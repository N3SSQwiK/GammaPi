# Tasks: Add Member Lifecycle Management

## 1. Database Schema Updates
- [ ] 1.1 Add `member_status` enum column to users table (ACTIVE, INACTIVE, KICKED, BANNED, SUSPENDED)
- [ ] 1.2 Add `left_at` timestamp column to users table
- [ ] 1.3 Add `kicked_at` timestamp column to users table
- [ ] 1.4 Create `suspensions` table (id, user_id, suspended_by, duration, reason, started_at, ends_at, appealed, appeal_vote_id)
- [ ] 1.5 Create `votes` table (id, type, target_user_id, initiated_by, reason, created_at, closes_at, status, outcome)
- [ ] 1.6 Create `vote_ballots` table (vote_id, voter_id, weight, cast_at)
- [ ] 1.7 Create `audit_log` table (id, action_type, target_user_id, initiated_by, reason, vote_id, timestamp, outcome)

## 2. Repository Layer
- [ ] 2.1 Add lifecycle methods to userRepository (updateStatus, markInactive, markKicked, markBanned)
- [ ] 2.2 Create suspensionRepository (create, getActive, expire, appeal)
- [ ] 2.3 Create voteRepository (create, cast, tally, close)
- [ ] 2.4 Create auditLogRepository (log, getByUser, getByAction)

## 3. Core Lifecycle Handlers
- [ ] 3.1 Implement guildMemberRemove event handler (detect leave vs kick)
- [ ] 3.2 Implement guildMemberAdd event handler (detect returning members)
- [ ] 3.3 Implement suspension scheduler (auto-restore expired suspensions)

## 4. Suspension System
- [ ] 4.1 Create `/suspend` command (E-Board only)
- [ ] 4.2 Create `/unsuspend` command (E-Board only)
- [ ] 4.3 Create suspension role with restricted permissions
- [ ] 4.4 Implement suspension button handler for appeal
- [ ] 4.5 Create `/appeal` command for suspended members

## 5. Revocation System
- [ ] 5.1 Create `/vote-revoke` command (initiate kick/ban vote)
- [ ] 5.2 Create `/vote` command (cast ballot)
- [ ] 5.3 Implement vote embed with live tally display
- [ ] 5.4 Implement vote closing logic (48hr timeout or quorum)
- [ ] 5.5 Implement weighted voting (3x for ΓΠ, 1x for Visiting)
- [ ] 5.6 Implement two-thirds majority calculation
- [ ] 5.7 Execute kick/ban on vote success

## 6. Returning Member Flow
- [ ] 6.1 Create `/welcome-back` command
- [ ] 6.2 Implement light verification modal (pre-filled data)
- [ ] 6.3 Implement kicked member cooldown check (7 days)
- [ ] 6.4 Implement > 1 year full re-verification redirect

## 7. Notifications
- [ ] 7.1 DM member on suspension
- [ ] 7.2 DM member on suspension end (auto-restore)
- [ ] 7.3 Post to audit channel on all E-Board actions
- [ ] 7.4 DM vouchers when kick/ban vote initiated

## 8. Golden State Updates
- [ ] 8.1 Add Suspended role to requirements
- [ ] 8.2 Configure Suspended role permissions (view only, no send/react/voice)

## 9. Testing
- [ ] 9.1 Test voluntary leave → return < 1 year flow
- [ ] 9.2 Test voluntary leave → return > 1 year flow
- [ ] 9.3 Test kick → 7 day cooldown → return flow
- [ ] 9.4 Test suspension → appeal → vote flow
- [ ] 9.5 Test revocation vote → kick flow
- [ ] 9.6 Test revocation vote → ban flow
- [ ] 9.7 Test weighted voting calculation
