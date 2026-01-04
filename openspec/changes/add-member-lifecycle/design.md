# Design: Add Member Lifecycle Management

## Context

The fraternity needs to manage member lifecycle beyond initial verification:
- Members leave and return (voluntarily or via discipline)
- E-Board needs tools to suspend/remove problematic members
- Democratic process required for serious actions (kick/ban)
- Audit trail required for accountability

## Goals / Non-Goals

### Goals
- Track member status throughout their lifecycle
- Enable swift E-Board action for disruptions (suspension)
- Require democratic consensus for permanent actions (kick/ban)
- Provide graceful return path for members who left voluntarily
- Maintain complete audit trail of all administrative actions

### Non-Goals
- Automated moderation (spam detection, etc.)
- Cross-server reputation tracking
- Integration with national fraternity systems

## Decisions

### Decision 1: Suspension is Unilateral with Appeal

**What:** Any E-Board member can suspend immediately; suspended member can appeal to trigger vote.

**Why:**
- Disruptions need immediate response (can't wait 48 hours)
- Appeal process provides accountability check
- Suspensions are temporary (1-7 days), so low risk of abuse

**Alternatives considered:**
- E-Board vote for all suspensions → Too slow for active disruptions
- No appeal process → Risk of abuse without accountability

### Decision 2: Weighted Voting (3x for ΓΠ Brothers)

**What:** ΓΠ Brother votes count as 3x; Visiting Brother votes count as 1x.

**Why:**
- Local chapter members have more stake in community health
- Still allows visiting brothers to participate
- E-Board votes as ΓΠ Brothers (no separate weight)

**Alternatives considered:**
- Equal voting → Dilutes local chapter authority
- E-Board only voting → Not democratic enough for serious actions

### Decision 3: 7-Day Cooldown for Kicked Members

**What:** Kicked members cannot rejoin for 7 days.

**Why:**
- Prevents immediate rejoin that defeats the purpose of kick
- Long enough to be meaningful, short enough to allow return
- Distinguishes kick (temporary consequence) from ban (permanent)

**Alternatives considered:**
- No cooldown → Kick becomes meaningless
- 30-day cooldown → Too punitive for minor infractions
- E-Board decides per case → Inconsistent enforcement

### Decision 4: < 1 Year = Light Re-Verification

**What:** Brothers returning within 1 year only need to re-agree to Code of Conduct and confirm identity (pre-filled modal). No vouchers needed.

**Why:**
- Recognizes they were already verified
- Reduces friction for legitimate returns
- Still requires explicit CoC re-agreement
- Pre-filled data confirms identity without redundant typing

**Alternatives considered:**
- Full re-verification for all → Punishes legitimate returns
- Automatic role restoration → No accountability for return
- 6-month cutoff → Arbitrary, 1 year aligns with annual cycles

## Data Model

### Member Status States

```
ACTIVE ─────┬──── leaves voluntarily ────▶ INACTIVE
            │
            ├──── E-Board suspends ──────▶ SUSPENDED ──┬── time expires ──▶ ACTIVE
            │                                          └── appeal succeeds ─▶ ACTIVE
            │
            └──── vote passes ───────────▶ KICKED ──── 7 days + vote ─────▶ ACTIVE
                                     or ─▶ BANNED ──── (permanent)
```

### Vote Tally Calculation

```typescript
function calculateTally(votes: Ballot[]): { yes: number; no: number; total: number } {
  let yes = 0, no = 0;
  for (const vote of votes) {
    const weight = vote.voterRole === 'ΓΠ Brother' ? 3 : 1;
    if (vote.choice === 'yes') yes += weight;
    else no += weight;
  }
  return { yes, no, total: yes + no };
}

function hasTwoThirdsMajority(tally: { yes: number; total: number }): boolean {
  return tally.yes >= (tally.total * 2 / 3);
}
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| E-Board abuse of suspension power | Appeal process allows community override |
| Vote manipulation (alt accounts) | Only verified brothers can vote; weight system favors established members |
| Returning bad actors | Kicked members require E-Board vote to return |
| Suspension role misconfigured | Include in Golden State setup; audit checks |

## Migration Plan

1. Add new database tables (non-destructive)
2. Add `member_status` column with default 'ACTIVE'
3. Deploy new commands
4. Run `/setup` to create Suspended role
5. No data migration needed (all current members are ACTIVE)

## Open Questions

- Should there be a maximum suspension duration? (Currently: 1 week max)
- Should votes be anonymous or public? (Currently: Public - logged to audit)
- Should there be a quorum requirement for votes? (Currently: No - uses time-based close)
