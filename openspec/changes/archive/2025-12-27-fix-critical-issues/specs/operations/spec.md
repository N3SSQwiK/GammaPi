## MODIFIED Requirements
### Requirement: Meeting Attendance
The bot MUST be able to track attendance for a specific meeting duration.

#### Scenario: User Check-in
- **WHEN** a user clicks "Check In"
- **THEN** their UserID MUST be persisted to the `attendees` list in the database `attendance` table.
