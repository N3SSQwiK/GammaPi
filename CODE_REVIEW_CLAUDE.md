# FiotaBot Code Review & Architectural Critique

**Reviewed by:** Claude (Opus 4.5)
**Date:** 2025-12-27
**Codebase:** `fiota-bot/` (19 TypeScript files)

---

## Review Methodology

- Examined 19 TypeScript files across commands, modules, events, and lib layers
- Cross-referenced implementation against `FiotaBot_Spec.md` requirements
- Evaluated security posture for a VPS-hosted, self-managed environment

---

## STRENGTHS

### 1. TypeScript Configuration & Patterns
- **Strict mode enabled** (`tsconfig.json:9`) — catches null/undefined issues at compile time
- **Modern ES2022 target** — enables native `Promise`, `async/await` without polyfills
- **Proper discord.js typing** — module augmentation for `client.commands` is correctly done (`index.ts:9-13`)

### 2. Discord.js Best Practices (Mostly Correct)
- **Deferred replies** for long operations: `await interaction.deferReply()` is used correctly in `audit.ts`, `setup.ts` (`auditHandler.ts:90`, `setup.ts:13`)
- **Ephemeral responses** for sensitive data (`find.ts:25`, `mentor.ts:34`) — other members can't see search results
- **Error recovery in interactionCreate**: Checks `interaction.replied || interaction.deferred` before responding (`interactionCreate.ts:19-23`)
- **Permission guards**: Uses `setDefaultMemberPermissions(PermissionFlagsBits.Administrator)` for privileged commands (`audit.ts:8`, `setup.ts:8`)

### 3. Architectural Separation
- **Clear layering**: `commands/` → `modules/` → `lib/` follows single-responsibility
- **"Golden State" pattern** (`serverConfig.ts`) is elegant — defines infrastructure-as-code in pure TypeScript
- **Reusable audit logic**: `performAudit()` is called by both `/audit` command AND `runAutomatedAudit()` scheduler

### 4. SQLite Choice is Appropriate
- **better-sqlite3** is synchronous but fast for single-server use — correct for VPS constraints
- **Schema design** is normalized appropriately for the use case (users, tickets, attendance)

### 5. Scheduler Design
- **Clean cron integration** with configurable schedule via `.env`
- **Guild fetch pattern** (`scheduler.ts:15`) correctly handles multi-guild scenarios

---

## CRITICAL WEAKNESSES

### 1. SQL Injection Vulnerability Pattern in `/find` Command
**Location:** `find.ts:13-21`

```typescript
let query = 'SELECT real_name, industry, zip_code FROM users WHERE status = "BROTHER"';
// ...
if (industry) {
    query += ' AND industry LIKE ?';
    params.push(`%${industry}%`);
}
```

**Issue:** While parameterized queries ARE used for `industry`, the `city` option is defined but never implemented. The bigger issue is **the pattern encourages string concatenation**. The `status = "BROTHER"` uses double-quotes (SQL string literal) which works but is SQLite-specific.

**Risk:** Low currently (params are used), but the pattern is fragile for future maintainers.

---

### 2. Race Condition in Verification Approval
**Location:** `accessHandler.ts:60-81`

```typescript
const ticket = stmt.get(ticketId) as any;
// ... validation ...
if (!ticket.voucher_1) {
    db.prepare('UPDATE ...').run(...);  // No transaction!
} else {
    db.prepare('UPDATE ...').run(...);
}
```

**Issue:** Two brothers clicking "Approve" simultaneously could both see `voucher_1 = null` and both become `voucher_1`, never triggering the second approval.

**Impact:** Verification stuck at 1/2 forever.

---

### 3. Attendance Does NOT Actually Record Attendees
**Location:** `attendance.ts:34-40`

```typescript
collector?.on('collect', async i => {
    if (i.customId === `attend_${meetingId}`) {
        // "In a real app, parse the JSON attendees..."
        await i.reply({ content: '✅ Checked in!', ephemeral: true });
    }
});
```

**Issue:** The check-in button **never updates the database**. Attendees array stays `'[]'` forever.

**Impact:** The Secretary will never get a meaningful attendance report.

---

### 4. Unbounded Embed Descriptions
**Location:** `auditHandler.ts:77`, `setup.ts:20`

```typescript
.setDescription(report.length > 0 ? report.join('\n') : '✅ ...')
// and
.setDescription(report.join('\n').substring(0, 4000))
```

**Issue:** Discord embed descriptions are limited to **4096 characters**. The `setup.ts` truncates at 4000 (good), but `auditHandler.ts` does NOT truncate.

**Impact:** If many issues exist, the bot will throw a Discord API error.

---

### 5. Dynamic Import Race Condition at Startup
**Location:** `index.ts:36-44, 54-62`

```typescript
import(filePath).then(eventModule => {
    // ...
});
```

**Issue:** Commands and events are loaded via dynamic `import()` with `.then()` handlers. This means:
1. The `client.login()` call at line 69 may execute BEFORE commands are loaded
2. Commands/events may not be ready when the first interaction arrives

**Impact:** First few commands after restart may fail with "No command matching X was found."

---

### 6. Hardcoded Admin Channel ID
**Location:** `accessHandler.ts:113`

```typescript
const adminChannelId = 'REPLACE_WITH_CHANNEL_ID';
```

**Issue:** This stub was never wired to `config.ts`. The verification ticket is never actually sent to admins.

**Impact:** The entire Dual-Voucher system is non-functional.

---

### 7. No Role Actually Granted After Verification
**Location:** `accessHandler.ts:79`

```typescript
// Grant Role Logic (Stub)
await interaction.reply({ content: `✅✅ Second approval recorded! User has been Verified.` });
```

**Issue:** After 2/2 approvals, no `Brother` role is granted. The user remains in limbo.

---

### 8. Vote Command Uses Reactions, Not Buttons
**Location:** `vote.ts:19-23`

**Issue:** Reaction-based voting is easily gamed (users can add multiple reactions) and doesn't prevent duplicate votes. Discord's Button/SelectMenu with component collectors is more robust.

---

### 9. No Graceful Shutdown Handling
**Issue:** There's no handler for `SIGINT` or `SIGTERM`. When the VPS restarts or PM2 restarts the process:
- Active collectors (attendance) are lost
- No cleanup of database connections

---

### 10. Missing Error Handling in Button/Modal Handlers
**Location:** `accessHandler.ts`

**Issue:** `handleAccessButton` and `handleAccessModal` have no try/catch. A database error will crash the process.

---

## ARCHITECTURAL CONCERNS

### A. Commands vs Modules Boundary
Currently, some commands (like `audit.ts`) correctly delegate to modules, while others (like `vote.ts`, `attendance.ts`) contain all logic inline. This inconsistency makes testing and reuse difficult.

**Recommendation:** Extract `attendance.ts` collector logic to `modules/attendance/attendanceHandler.ts`.

---

### B. "Golden State" Scalability
The `serverConfig.ts` approach is excellent for a single chapter, but if FiotaBot ever becomes multi-tenant:
- The config would need to be per-guild (database-driven)
- The current design couples config to code deploys

**For now:** This is acceptable. The pattern is clean for single-guild use.

---

### C. Missing Database Abstraction Layer
Every command directly calls `db.prepare()`. This:
- Scatters SQL throughout the codebase
- Makes testing difficult (no mocking point)
- Risks SQL statement cache fragmentation

**Recommendation:** Create `lib/repositories/userRepository.ts`, `ticketRepository.ts`, etc.

---

### D. No Logging Framework
All logging is `console.log/warn/error`. On a VPS:
- Logs disappear after PM2 rotates them
- No structured logging for debugging production issues

**Recommendation:** Add `pino` or `winston` with file/rotation support.

---

## SECURITY ANALYSIS

| Area | Status | Notes |
|------|--------|-------|
| SQL Injection | Safe (for now) | Parameterized queries used, but pattern is fragile |
| Permission Checks | Partial | `/verify` says "Admin Only" in description but has no actual check |
| Token Storage | Good | Uses `.env` with dotenv |
| RBAC | Partial | `PermissionFlagsBits` used but not consistently |
| Input Validation | Minimal | Zip code max length enforced, but no format validation |
| @everyone Audit | Excellent | `FORBIDDEN_EVERYONE_PERMS` is a great security baseline |

---

## ACTIONABLE REFACTORING RECOMMENDATIONS

### Priority 1: Critical Fixes (Do Immediately)

1. **Fix Attendance Data Persistence**
   - Actually update the `attendees` JSON array in the database when users click check-in

2. **Add Transaction to Verification Approval**
   ```typescript
   const approveTicket = db.transaction((ticketId, approverId) => {
       const ticket = db.prepare('SELECT ... FOR UPDATE').get(ticketId);
       // ... rest of logic
   });
   ```

3. **Wire Up Admin Channel Config**
   - Add `VERIFICATION_CHANNEL_ID` to `config.ts`
   - Actually send the embed to that channel

4. **Grant Role After Verification**
   - Implement the role grant logic, fetching the `🦁 ΓΠ Brother` role

### Priority 2: Stability Improvements

5. **Await Dynamic Imports at Startup**
   ```typescript
   const loadCommands = async () => {
       const files = fs.readdirSync(commandsPath);
       await Promise.all(files.map(file => import(...)));
   };
   await loadCommands();
   client.login(config.DISCORD_TOKEN);
   ```

6. **Add Graceful Shutdown**
   ```typescript
   process.on('SIGINT', async () => {
       db.close();
       client.destroy();
       process.exit(0);
   });
   ```

7. **Truncate Audit Report**
   - Add `.substring(0, 4000)` to audit embed description

### Priority 3: Code Quality

8. **Extract Repository Layer**
   - Create `src/lib/repositories/` with typed methods like `getUserByDiscordId()`, `createVerificationTicket()`

9. **Add Error Boundaries to Handlers**
   ```typescript
   export async function handleAccessButton(interaction: Interaction) {
       try {
           // ...
       } catch (error) {
           console.error('[Access] Button error:', error);
           if (!interaction.replied) {
               await interaction.reply({ content: 'An error occurred.', ephemeral: true });
           }
       }
   }
   ```

10. **Replace Reaction Voting with Buttons**
    - Use `ButtonBuilder` with a component collector for vote integrity

---

## SPEC ALIGNMENT CHECK

| Spec Feature | Implemented | Status |
|--------------|-------------|--------|
| Dual-Voucher System | Partial | Ticket creation works, but admin notification and role grant missing |
| LinkedIn OAuth | Stub only | Just returns a placeholder link |
| /find (Rolodex) | Working | Queries users by industry |
| /mentor toggle | Working | Updates DB correctly |
| /attendance | Partial | Button works but doesn't persist check-ins |
| /vote | Basic | Uses reactions (spec says "single vote per user") |
| /audit | Working | Excellent implementation |
| /setup (IaC) | Working | Creates missing roles/channels |
| Weekly Audit Scheduler | Working | Cron + channel posting |
| CSV Export | Missing | Spec mentions this for attendance |

---

## OVERALL ASSESSMENT

The codebase shows solid TypeScript/Discord.js fundamentals with a clean "Golden State" IaC pattern. However, several **critical stubs were never completed**, making the core verification flow non-functional. The scheduler and audit modules are production-ready; focus refactoring on the access and attendance modules.

---

## Summary

| Category | Grade | Comment |
|----------|-------|---------|
| **Code Quality** | B- | Good TS patterns, but stubs left incomplete |
| **Architecture** | B+ | Clean separation, Golden State pattern is elegant |
| **Security** | B | Parameterized queries, but some permission gaps |
| **Resilience** | C+ | No shutdown handling, race conditions exist |
| **Spec Alignment** | C | ~50% of spec features are actually functional |

**Top 3 Actions:**
1. Complete the verification flow (admin notification → role grant)
2. Fix the attendance check-in persistence
3. Add async startup and graceful shutdown
