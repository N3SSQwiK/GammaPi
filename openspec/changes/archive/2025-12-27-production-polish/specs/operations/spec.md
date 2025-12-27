## MODIFIED Requirements
### Requirement: Simple Voting
The bot MUST allow officers to create secure polls using interactive components and persistent storage.

#### Scenario: Restart Survival
- **WHEN** a vote is in progress and the bot restarts
- **THEN** previous votes MUST be preserved in the database and correctly reflected when new votes are cast.
