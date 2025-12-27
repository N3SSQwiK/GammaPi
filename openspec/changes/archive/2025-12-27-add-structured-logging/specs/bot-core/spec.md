## ADDED Requirements
### Requirement: Structured Logging
The bot MUST use a structured logging library to capture operational events and errors.

#### Scenario: Production Logging
- **WHEN** an event occurs (e.g., "User Verified" or "Database Error")
- **THEN** it MUST be written to a persistent log file in JSON format with a timestamp and severity level.

#### Scenario: Console Output
- **WHEN** running in development
- **THEN** logs SHOULD be pretty-printed to the console for readability.
