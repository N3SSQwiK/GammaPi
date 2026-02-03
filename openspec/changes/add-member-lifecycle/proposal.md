# Change: Add Member Lifecycle Management

## Why

Currently, the system only handles initial verification. There is no defined behavior for:
- Members who leave and return to the server
- E-Board disciplinary actions (suspension, revocation)
- Audit trails for administrative actions
- Weighted voting for disciplinary decisions

This creates gaps when members leave/return or when E-Board needs to take action against problematic members.

## What Changes

### New Capabilities
- **Member Status Tracking**: Track ACTIVE, INACTIVE, KICKED, BANNED, SUSPENDED states
- **Returning Member Flow**: Lightweight re-verification for members gone < 1 year
- **Suspension System**: E-Board can unilaterally suspend with appeal option
- **Revocation System**: Formal vote to kick/ban members (two-thirds majority)
- **Weighted Voting**: ΓΠ Brothers get 3x vote weight vs Visiting Brothers (1x)
- **Audit Trail**: All E-Board actions logged to database
- **Auto-Restoration**: Suspended members auto-restored with notifications

### New Commands
- `/suspend @user duration:[1d|3d|1w] reason:"..."` - E-Board suspends member
- `/unsuspend @user` - E-Board lifts suspension early
- `/appeal` - Suspended member requests vote to overturn
- `/vote-revoke @user action:[kick|ban] reason:"..."` - Initiate kick/ban vote
- `/vote` - Cast vote on open proposals
- `/welcome-back` - Returning member re-verification

### **BREAKING** Changes
- Members who leave will need to re-verify (no automatic role restoration)
- Kicked members face 7-day cooldown before rejoining

## Impact

- **Affected specs**: `access-control`
- **Affected code**:
  - `src/lib/repositories/userRepository.ts` - New status field, lifecycle methods
  - `src/modules/access/` - New suspension/revocation handlers
  - New command files for `/suspend`, `/appeal`, `/vote-revoke`, `/welcome-back`
  - Database schema changes (new tables for votes, suspensions, audit log)
