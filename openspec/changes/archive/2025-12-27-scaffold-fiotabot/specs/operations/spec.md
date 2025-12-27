## ADDED Requirements
### Requirement: Meeting Attendance
The bot MUST be able to track attendance for a specific meeting duration.

#### Scenario: Start Attendance
- **WHEN** an Officer runs `/attendance duration:15`
- **THEN** a "Check In" button appears in the channel.

#### Scenario: User Check-in
- **WHEN** a user clicks "Check In"
- **THEN** their UserID is logged to the database for the current meeting.

### Requirement: Simple Voting
The bot MUST allow officers to create simple polls.

#### Scenario: Create Poll
- **WHEN** an Officer runs `/vote topic:"Pizza vs Tacos"`
- **THEN** a poll Embed is created with reaction or button options.
