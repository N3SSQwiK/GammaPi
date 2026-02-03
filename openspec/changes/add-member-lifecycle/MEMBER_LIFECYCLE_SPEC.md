# Member Lifecycle Specification

## 1. Member Status Tracking

| Status | Description | Can Rejoin? |
|--------|-------------|-------------|
| `ACTIVE` | Currently verified and in server | N/A |
| `INACTIVE` | Left voluntarily, record preserved | Yes |
| `KICKED` | Removed by E-Board, 7-day cooldown | Yes (after cooldown) |
| `BANNED` | Permanently removed | No (Discord blocks) |
| `SUSPENDED` | Temporarily restricted, still in server | N/A |

**Database Behavior:**
- All records preserved regardless of exit type (for audit trail)
- Sensitive data (phone, city, etc.) retained for returning members

---

## 2. Returning Members

### 2a. Voluntary Leave (INACTIVE)

| Gone For | Process |
|----------|---------|
| **< 1 year** | 1. Re-agree to Code of Conduct<br>2. Confirm identity (modal with pre-filled name/chapter)<br>3. Any ΓΠ Brother can approve<br>**No vouchers needed** |
| **> 1 year** | Full re-verification (same as new member – vouchers required) |

### 2b. Kicked Members (after 7-day cooldown)

| Member Type | Process |
|-------------|---------|
| **Brother** | 1. Re-agree to Code of Conduct<br>2. Formal E-Board vote to approve return |
| **Guest** | 1. Standard guest verification (TBD)<br>2. Formal E-Board vote to approve return |

*If they attempt to rejoin before 7 days: Bot rejects with message showing remaining cooldown time.*

### 2c. Banned Members

Cannot rejoin. Discord blocks them at the platform level. Record marked as `BANNED` for audit purposes.

---

## 3. Suspension (Unilateral + Appeal)

### Initiation
```
/suspend @user duration:[1d|3d|1w] reason:"..."
```
- **Who can suspend:** Any E-Board member
- **Immediate effect:** User loses privileges instantly

### Restrictions During Suspension
| Action | Allowed? |
|--------|----------|
| View channels | ✅ Yes (except sensitive channels like #verification-requests) |
| Send messages | ❌ No |
| React to messages | ❌ No |
| Join voice channels | ❌ No |

### Appeal Process
```
Suspended user runs: /appeal
         │
         ▼
    Triggers formal vote (48 hrs, two-thirds majority, all brothers)
         │
         ├── Vote passes → Suspension lifted immediately
         └── Vote fails → Suspension continues as scheduled
```

### Auto-Restoration
- Bot tracks suspension expiration
- When time expires:
  - Roles automatically restored
  - DM sent to member: "Your suspension has ended. Welcome back."
  - Log posted to audit channel

---

## 4. Revocation (Kick/Ban via Formal Vote)

### Initiation
```
/vote-revoke @user action:[kick|ban] reason:"..."
```
- **Who can initiate:** Any ΓΠ Brother

### Voting Rules

| Parameter | Value |
|-----------|-------|
| **Duration** | 48 hours |
| **Who votes** | All verified brothers |
| **Vote weight** | 🦁 ΓΠ Brother = 3x<br>🦁 Visiting Brother = 1x |
| **E-Board weight** | Vote as ΓΠ Brothers (3x) |
| **Threshold** | Two-thirds majority |

### Outcome
- **If kick:** Member removed, status set to `KICKED`, 7-day cooldown applies
- **If ban:** Member banned, status set to `BANNED`, cannot return

---

## 5. Audit Trail

All E-Board actions logged to database:

| Field | Description |
|-------|-------------|
| `action_type` | SUSPEND, REVOKE_KICK, REVOKE_BAN, APPEAL, etc. |
| `target_user_id` | Discord ID of affected member |
| `initiated_by` | Discord ID of E-Board member |
| `reason` | Text explanation |
| `vote_id` | Link to vote record (if applicable) |
| `timestamp` | When action occurred |
| `outcome` | APPROVED, REJECTED, EXPIRED, etc. |

---

## 6. New Commands Required

| Command | Who Can Use | Purpose |
|---------|-------------|---------|
| `/suspend` | E-Board | Immediately suspend a member |
| `/unsuspend` | E-Board | Manually lift suspension early |
| `/appeal` | Suspended member | Request vote to overturn suspension |
| `/vote-revoke` | Any ΓΠ Brother | Initiate kick/ban vote |
| `/vote` | Verified brothers | Cast vote on open proposals |
| `/welcome-back` | Returning member | Trigger return verification flow |

---

## Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MEMBER LIFECYCLE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ACTIVE MEMBER                                                              │
│       │                                                                      │
│       ├── Leaves voluntarily ──▶ INACTIVE ──▶ Returns < 1yr ──▶ Light verify│
│       │                                   └──▶ Returns > 1yr ──▶ Full verify│
│       │                                                                      │
│       ├── E-Board suspends ──▶ SUSPENDED ──┬──▶ Time expires ──▶ ACTIVE     │
│       │                                    └──▶ Appeals ──▶ Vote ──▶ ?      │
│       │                                                                      │
│       └── Brothers vote ──▶ REVOKED ──┬──▶ Kick ──▶ KICKED (7d cooldown)   │
│                                       └──▶ Ban ──▶ BANNED (permanent)       │
│                                                                              │
│  KICKED ──▶ 7 days pass ──▶ Returns ──▶ CoC + E-Board vote ──▶ ACTIVE      │
│                                                                              │
│  BANNED ──▶ Cannot return                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Design Principles

1. **Proportionality** – Suspensions are fast (unilateral), revocations require consensus
2. **Accountability** – All actions logged, appeals available
3. **Weighted democracy** – Local chapter brothers have more say (3x vote weight)
4. **Graceful return** – Voluntary leavers get a streamlined path back
