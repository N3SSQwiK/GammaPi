## ADDED Requirements
### Requirement: Pipeline State Management
The bot MUST track the application status of each candidate and adjust permissions accordingly.

#### Scenario: Status Update
- **WHEN** the Line Committee runs `/pipeline set @User status:Interview`
- **THEN** the user is added to the "Interview" role (granting access to `#interview-schedule`) and the change is logged in `#committee-logs`.

### Requirement: Committee-Only Visibility
Sensitive data (applications, internal debriefs) MUST be visible ONLY to the "Line Committee" role.

#### Scenario: Committee Discussion
- **WHEN** a Committee member posts in `#application-reviews`
- **THEN** General Brothers cannot see or access this channel.
