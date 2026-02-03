# OpenSpec Gap Analysis: `/init` Consolidation

**Date:** 2026-01-02
**Scope:** Compare documented specs/proposals against actual `/init` implementation

---

## Executive Summary

The `/init` command consolidates functionality from multiple sources into a single server initialization flow. This has created gaps between documentation and implementation that need to be reconciled.

| Category | Status |
|----------|--------|
| Proposals needing updates | 2 |
| Specs needing updates | 3 |
| New behaviors to document | 6 |
| Commands deleted | 2 (`/setup`, `/bootstrap`) |

---

## 1. Proposal Gaps

### 1.1 `add-bootstrap-flow` — NEEDS UPDATE OR ARCHIVE

**What it documents:**
- Standalone `/bootstrap` command for server owner
- Modal flow with First Name, Last Name, Don Name (optional), Year/Semester
- Chapter hardcoded to `gamma-pi`
- No industry collection
- No infrastructure setup

**What was actually implemented (`/init`):**
- Consolidated command that combines `/setup` + `/bootstrap` + embed posting
- Chapter/Industry collected via autocomplete (not hardcoded)
- Two-modal flow with "Light the Torch" button
- Don Name is **required** (not optional)
- Collects: First Name, Last Name, Don Name, Year/Semester, Job Title, Phone, City
- Automatically posts Rules embed to #rules-and-conduct
- Automatically posts Verification Gate to #welcome-gate
- Can register **other users** as founding brothers (not just self)

**Gaps:**

| Documented | Actual | Gap Type |
|------------|--------|----------|
| `/bootstrap` command | `/init` command | Command renamed/consolidated |
| Chapter hardcoded to gamma-pi | Chapter via autocomplete (all chapters including hidden) | Feature change |
| Don Name optional | Don Name required | Requirement change |
| No industry field | Industry collected via autocomplete | Field added |
| Single modal | Two-modal flow with button bridge | UX change |
| Self-registration only | Can register other users via `user` option | Feature added |
| No infrastructure setup | Runs `runSetup()` first | Feature added |
| No embed posting | Posts Rules + Verification Gate automatically | Feature added |

**Recommended action:** Archive this proposal and create a new `add-init-command` proposal, or update this proposal with the actual implementation.

---

### 1.2 `enhance-verification-ux` — PARTIAL IMPLEMENTATION

**What it documents:**
- Multi-step verification with autocomplete
- Two-modal flow
- Don Name (optional)
- Named voucher system

**What was actually implemented:**
- Multi-step verification ✅
- Two-modal flow ✅
- Don Name **required** (changed from optional)
- Named voucher system ✅

**Gaps:**

| Documented | Actual | Gap Type |
|------------|--------|----------|
| Don Name optional | Don Name required | Requirement change |
| Zip/City field | City only (no zip parsing) | Simplified |

**Recommended action:** Update the spec delta to reflect Don Name as required.

---

### 1.3 `enhance-verification-landing-page` — NOT STARTED

This proposal adds imagery/branding to verification embeds. It has not been implemented yet but is still valid for future work. No gaps to resolve.

---

## 2. Spec Gaps

### 2.1 `access-control/spec.md` — NEEDS UPDATE

**Current documentation:**
- Don Name listed as optional in Modal 1
- No mention of Rules check before verification
- No mention of auto-restore role for returning users

**Actual implementation:**
- Don Name is **required** for brothers
- Rules check added: must have `✅ Rules Accepted` role before `/verify-start`
- Auto-restore: if user has DB record of rules agreement but lost role (rejoined), role is restored

**Specific changes needed:**

```markdown
## Current (line 32-34):
- Don Name (optional, placeholder: "Phoenix - without 'Don' prefix")

## Should be:
- Don Name (required, placeholder: "Phoenix")
```

```markdown
## ADD new scenario:
#### Scenario: Rules agreement required before verification
- **WHEN** user runs `/verify-start` or clicks "🦁 I'm a Brother"
- **AND** user does not have `✅ Rules Accepted` role
- **AND** user has not agreed to rules in database
- **THEN** system rejects with: "You must agree to the Code of Conduct first."

#### Scenario: Auto-restore rules role on rejoin
- **WHEN** user runs `/verify-start`
- **AND** user has rules agreement in database
- **AND** user does not have `✅ Rules Accepted` role (lost on rejoin)
- **THEN** system restores the role automatically
```

---

### 2.2 `bot-core/spec.md` — NEEDS UPDATE

**Current documentation:**
- References `/setup` command
- No mention of `/init` command
- No mention of automatic embed posting

**Actual implementation:**
- `/setup` was deleted (consolidated into `/init`)
- `/init` handles setup + bootstrap + embed posting

**Specific changes needed:**

```markdown
## Current (line 9-11):
- **WHEN** the bot starts or the `/setup` command is run
- **THEN** it MUST read configuration from `serverConfig.ts`

## Should be:
- **WHEN** the bot starts or the `/init` command is run
- **THEN** it MUST read configuration from `serverConfig.ts`
```

```markdown
## ADD new requirement:
### Requirement: Server Initialization Command
The system SHALL provide `/init` for complete server setup.

#### Scenario: /init consolidates setup and bootstrap
- **WHEN** server owner runs `/init chapter:<autocomplete> industry:<autocomplete>`
- **THEN** system runs Golden State setup (creates roles/channels)
- **AND** posts Rules embed to #rules-and-conduct
- **AND** posts Verification Gate to #welcome-gate
- **AND** shows "Light the Torch" button for founding brother registration
```

---

### 2.3 `audit/spec.md` — NEEDS UPDATE (Minor)

**Current documentation:**
- References `/audit` for validation

**Actual implementation:**
- `/audit` works correctly
- Should mention that `/init` also runs setup (validates Golden State)

---

## 3. New Behaviors to Document

The following behaviors were implemented but have no spec coverage:

| Behavior | Location | Description |
|----------|----------|-------------|
| Channel permission overwrites | Golden State | #welcome-gate and #verification-requests have permission overwrites configured |
| Rules check before verification | `/verify-start`, `verify_gate_start` | Users must accept CoC before verification |
| Auto-restore rules role | `/verify-start`, `verify_gate_start` | Rejoining users get role restored from DB |
| Automatic embed posting | `/init` | Rules + Verification Gate posted automatically |
| "Light the Torch" flow | `/init` | Two-modal founding brother registration |
| Target user registration | `/init` | Can register other users as founding brothers |

---

## 4. Deleted Commands

| Command | Fate | Notes |
|---------|------|-------|
| `/setup` | Deleted | Functionality merged into `/init` |
| `/bootstrap` | Deleted | Functionality merged into `/init` |

The command files no longer exist in `src/commands/`. Any references to these commands in documentation should be updated.

---

## 5. Recommended Actions

### Immediate (Before Next Release)

1. **Archive `add-bootstrap-flow`** — The implementation differs significantly; archive and document actual behavior
2. **Update `access-control/spec.md`** — Change Don Name to required, add Rules check scenarios
3. **Update `bot-core/spec.md`** — Replace `/setup` references with `/init`, document new command

### Near-Term

4. **Create new proposal or spec** for `/init` command documenting:
   - Consolidated setup + bootstrap + embed posting
   - Two-modal "Light the Torch" flow
   - Target user option for registering others

5. **Update `enhance-verification-ux`** — Note that Don Name is now required (deviated from proposal)

### Documentation Sync

6. **Update CLAUDE.md** — Verify all command references are current

---

## 6. Implementation vs Spec Comparison Table

| Feature | Spec Says | Code Does | Match? |
|---------|-----------|-----------|--------|
| Don Name | Optional | Required | ❌ |
| Rules check before verify | Not documented | Implemented | ❌ |
| Auto-restore rules role | Not documented | Implemented | ❌ |
| `/setup` command | Exists | Deleted (merged to `/init`) | ❌ |
| `/bootstrap` command | Exists | Deleted (merged to `/init`) | ❌ |
| `/init` command | Not documented | Exists | ❌ |
| Embed auto-posting | Not documented | `/init` does this | ❌ |
| Channel permissions | Not in Golden State | Added to requirements.ts | ❌ |
| Verification flow | Multi-modal | Multi-modal ✅ | ✅ |
| Named voucher approval | Any brother | Any brother ✅ | ✅ |
| E-Board override | `/verify-override` | Implemented ✅ | ✅ |
| Chapter assignment | `/chapter-assign` | Implemented ✅ | ✅ |

---

## Appendix: File Locations

| File | Purpose |
|------|---------|
| `/init` implementation | `fiota-bot/src/commands/init.ts` |
| Golden State setup | `fiota-bot/src/modules/audit/setupHandler.ts` |
| Channel permissions | `fiota-bot/src/modules/access/requirements.ts` |
| Rules handler | `fiota-bot/src/modules/access/rulesHandler.ts` |
| Verification handler | `fiota-bot/src/modules/access/accessHandler.ts` |
| Verification state | `fiota-bot/src/lib/verificationState.ts` |
