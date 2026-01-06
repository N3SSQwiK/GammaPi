## ADDED Requirements

### Requirement: Server Bootstrap Flow
The system SHALL provide a bootstrap command for server owners to seed initial brothers when the database is empty.

#### Scenario: Server owner bootstraps themselves
- **WHEN** server owner executes `/bootstrap`
- **AND** fewer than 2 brothers exist in the database
- **THEN** system presents modal with fields:
  - First Name (required)
  - Last Name (required)
  - Don Name (optional)
  - Initiation Year & Semester (required, placeholder: "2015 Spring")
- **AND** on submission:
  - Creates user record with status='BROTHER' and chapter='gamma-pi'
  - Assigns `🦁 ΓΠ Brother` role
  - Logs: "{user} bootstrapped as founding brother"
  - Replies: "✅ You have been registered as a founding brother."

#### Scenario: Non-owner attempts bootstrap
- **WHEN** a non-owner executes `/bootstrap`
- **THEN** system rejects with: "Only the server owner can use this command."

#### Scenario: Bootstrap disabled after threshold
- **WHEN** any user executes `/bootstrap`
- **AND** 2 or more brothers exist in the database
- **THEN** system rejects with: "Bootstrap is disabled. Use `/verify-start` for verification."

#### Scenario: Bootstrap with existing user record
- **WHEN** server owner executes `/bootstrap`
- **AND** owner already has a user record in database
- **AND** owner's status is not 'BROTHER'
- **THEN** system updates existing record to status='BROTHER'
- **AND** assigns `🦁 ΓΠ Brother` role
