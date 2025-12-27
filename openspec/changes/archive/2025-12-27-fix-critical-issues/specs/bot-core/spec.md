## MODIFIED Requirements
### Requirement: Bot Connectivity
The bot MUST connect to the Discord Gateway and maintain a persistent session.

#### Scenario: Successful Login
- **WHEN** the bot process starts
- **THEN** it MUST finish loading all Commands and Events BEFORE attempting to log in to the Discord Gateway.

## ADDED Requirements
### Requirement: Graceful Shutdown
The bot MUST handle system termination signals to ensure data integrity.

#### Scenario: Process Termination
- **WHEN** the bot receives a `SIGINT` or `SIGTERM` signal
- **THEN** it MUST close the database connection and destroy the client session before exiting.
