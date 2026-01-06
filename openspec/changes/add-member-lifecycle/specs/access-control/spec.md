# Access Control Spec Delta: Member Lifecycle

## ADDED Requirements

### Requirement: Member Status Tracking
The system SHALL track member status throughout their lifecycle.

#### Scenario: Status values
- **WHEN** querying a member's status
- **THEN** the status SHALL be one of: ACTIVE, INACTIVE, KICKED, BANNED, SUSPENDED

#### Scenario: Voluntary leave marks inactive
- **WHEN** a verified member leaves the server voluntarily
- **THEN** their status is set to INACTIVE
- **AND** their database record is preserved (name, chapter, industry, etc.)
- **AND** `left_at` timestamp is recorded

#### Scenario: Kicked member status
- **WHEN** a member is kicked via successful revocation vote
- **THEN** their status is set to KICKED
- **AND** `kicked_at` timestamp is recorded
- **AND** a 7-day cooldown begins

#### Scenario: Banned member status
- **WHEN** a member is banned via successful revocation vote
- **THEN** their status is set to BANNED
- **AND** Discord ban is applied (platform-level block)
- **AND** record is preserved for audit purposes

### Requirement: Returning Member Light Verification
The system SHALL provide streamlined re-verification for members returning within 1 year.

#### Scenario: Return within 1 year
- **WHEN** an INACTIVE member rejoins the server
- **AND** they left less than 1 year ago
- **THEN** they must re-agree to Code of Conduct
- **AND** they are shown a modal with pre-filled identity data (name, chapter)
- **AND** any ΓΠ Brother can approve their return
- **AND** no vouchers are required

#### Scenario: Return after 1 year
- **WHEN** an INACTIVE member rejoins the server
- **AND** they left more than 1 year ago
- **THEN** they must complete full re-verification (same as new member)
- **AND** vouchers are required

#### Scenario: Kicked member return
- **WHEN** a KICKED member attempts to rejoin
- **AND** less than 7 days have passed since kick
- **THEN** the system rejects with message showing remaining cooldown time

#### Scenario: Kicked member return after cooldown
- **WHEN** a KICKED member rejoins after 7-day cooldown
- **THEN** they must re-agree to Code of Conduct
- **AND** a formal E-Board vote is required to approve their return
- **AND** vote follows standard revocation vote rules (48hr, two-thirds majority)

### Requirement: Suspension System
The system SHALL allow E-Board to suspend members with appeal option.

#### Scenario: E-Board suspends member
- **WHEN** E-Board member executes `/suspend @user duration:[1d|3d|1w] reason:"..."`
- **THEN** target member immediately loses privileges
- **AND** member status is set to SUSPENDED
- **AND** member is assigned Suspended role
- **AND** member is DM'd with suspension details and appeal option
- **AND** action is logged to audit trail

#### Scenario: Suspended member restrictions
- **WHEN** a member has SUSPENDED status
- **THEN** they CAN view most channels
- **AND** they CANNOT send messages
- **AND** they CANNOT react to messages
- **AND** they CANNOT join voice channels
- **AND** they CANNOT see sensitive channels (e.g., #verification-requests)

#### Scenario: Suspension auto-expires
- **WHEN** suspension duration ends
- **THEN** Suspended role is automatically removed
- **AND** member status is set to ACTIVE
- **AND** member is DM'd: "Your suspension has ended. Welcome back."
- **AND** restoration is logged to audit channel

#### Scenario: E-Board lifts suspension early
- **WHEN** E-Board member executes `/unsuspend @user`
- **THEN** suspension ends immediately
- **AND** same restoration process as auto-expire

#### Scenario: Suspended member appeals
- **WHEN** suspended member executes `/appeal`
- **THEN** a formal vote is triggered
- **AND** vote follows revocation vote rules (48hr, two-thirds, weighted)
- **IF** vote passes (two-thirds vote to overturn):
  - Suspension is lifted immediately
- **IF** vote fails:
  - Suspension continues as scheduled

### Requirement: Revocation Vote System
The system SHALL require democratic vote for kick/ban actions.

#### Scenario: Initiate revocation vote
- **WHEN** any ΓΠ Brother executes `/vote-revoke @user action:[kick|ban] reason:"..."`
- **THEN** a vote is created with 48-hour duration
- **AND** vote embed is posted to appropriate channel
- **AND** named target is DM'd about the vote

#### Scenario: Cast vote
- **WHEN** a verified brother clicks vote button or executes `/vote`
- **AND** they have not already voted on this proposal
- **THEN** their vote is recorded with appropriate weight:
  - 🦁 ΓΠ Brother: 3x weight
  - 🦁 Visiting Brother: 1x weight
- **AND** vote embed updates with current tally

#### Scenario: Vote closes after 48 hours
- **WHEN** 48 hours have passed since vote creation
- **THEN** vote is closed
- **AND** final tally is calculated with weighted votes
- **IF** two-thirds majority (yes votes >= 2/3 of total weighted votes):
  - Action (kick or ban) is executed
  - Outcome logged to audit trail
- **IF** vote fails:
  - No action taken
  - Outcome logged to audit trail

#### Scenario: E-Board votes count as ΓΠ Brothers
- **WHEN** E-Board member casts vote
- **THEN** their vote weight is 3x (same as ΓΠ Brother)
- **AND** no additional weight for E-Board status

### Requirement: Audit Trail
The system SHALL log all E-Board administrative actions.

#### Scenario: Actions are logged
- **WHEN** any of these actions occur:
  - Suspension initiated
  - Suspension lifted (manual or auto)
  - Appeal submitted
  - Revocation vote initiated
  - Vote cast
  - Vote closed
  - Kick executed
  - Ban executed
  - Return approved
- **THEN** action is logged with:
  - action_type
  - target_user_id
  - initiated_by (user who triggered action)
  - reason (if applicable)
  - vote_id (if vote-related)
  - timestamp
  - outcome

#### Scenario: Audit log queryable
- **WHEN** E-Board queries audit log
- **THEN** they can filter by user, action type, or date range

### Requirement: Welcome Back Command
The system SHALL provide `/welcome-back` command for returning members.

#### Scenario: Light verification flow
- **WHEN** returning member (INACTIVE < 1 year) executes `/welcome-back`
- **THEN** system shows Code of Conduct agreement
- **AND** after agreement, shows pre-filled identity modal
- **AND** after confirmation, posts approval request
- **AND** any ΓΠ Brother can approve

#### Scenario: Kicked member uses welcome-back
- **WHEN** KICKED member (after 7-day cooldown) executes `/welcome-back`
- **THEN** system shows Code of Conduct agreement
- **AND** triggers formal E-Board vote for return approval

#### Scenario: Full re-verification redirect
- **WHEN** member gone > 1 year executes `/welcome-back`
- **THEN** system replies: "You've been away for over a year. Please use `/verify-start` for full verification."
