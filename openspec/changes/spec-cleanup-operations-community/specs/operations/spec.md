## ADDED Requirements

### Requirement: Attendance Tracking System
The system SHALL provide meeting attendance tracking with timed check-in windows.

#### Scenario: Officer starts attendance session
- **WHEN** officer runs `/attendance duration:<minutes>`
- **THEN** system creates attendance record in database
- **AND** posts check-in button with countdown message
- **AND** button remains active for specified duration

#### Scenario: Brother checks in
- **WHEN** brother clicks check-in button during active session
- **AND** brother has not already checked in
- **THEN** system records their discord_id in attendees array
- **AND** replies with ephemeral confirmation

#### Scenario: Duplicate check-in prevented
- **WHEN** brother clicks check-in button
- **AND** brother has already checked in to this session
- **THEN** system replies with ephemeral "already checked in" message
- **AND** does not duplicate the record

#### Scenario: Session closes automatically
- **WHEN** attendance duration expires
- **THEN** system posts session closed message with meeting ID
- **AND** check-in button becomes inactive

### Requirement: Attendance Data Schema
The system SHALL persist attendance in the `attendance` table.

#### Scenario: Attendance table structure
- **WHEN** database is initialized
- **THEN** attendance table contains:
  - `meeting_id` (INTEGER PRIMARY KEY AUTOINCREMENT)
  - `date` (TEXT NOT NULL) - ISO timestamp
  - `topic` (TEXT) - meeting topic description
  - `attendees` (TEXT) - JSON array of discord_ids

### Requirement: Voting Data Schema
The system SHALL persist votes in the `votes` table with upsert behavior.

#### Scenario: Votes table structure
- **WHEN** database is initialized
- **THEN** votes table contains:
  - `poll_id` (TEXT) - unique poll identifier
  - `user_id` (TEXT) - voter's discord_id
  - `choice` (TEXT) - vote selection (vote_yes, vote_no, vote_abstain)
  - PRIMARY KEY on (poll_id, user_id)

#### Scenario: Vote change overwrites previous
- **WHEN** user votes on a poll
- **AND** user has already voted on that poll
- **THEN** system updates their choice (upsert behavior)
- **AND** previous vote is replaced, not duplicated

## MODIFIED Requirements

### Requirement: Simple Voting
The bot MUST allow officers to create secure polls using interactive components and persistent storage.

#### Scenario: Restart Survival
- **WHEN** a vote is in progress and the bot restarts
- **THEN** previous votes MUST be preserved in the database and correctly reflected when new votes are cast.

#### Scenario: Vote counting
- **WHEN** poll results are retrieved
- **THEN** system aggregates votes by choice (yes, no, abstain)
- **AND** returns counts for each option
