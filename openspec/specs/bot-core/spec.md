## ADDED Requirements
### Requirement: Bot Connectivity
The bot MUST connect to the Discord Gateway and maintain a persistent session.

#### Scenario: Successful Login
- **WHEN** the bot process starts with a valid token
- **THEN** it logs "Logged in as FiotaBot" to the console and sets its status to "Watching over Gamma Pi".

### Requirement: Slash Command Handling
The bot MUST register and handle application commands (Slash Commands).

#### Scenario: Unknown Command
- **WHEN** a user triggers a registered command that has no handler
- **THEN** the bot replies with an ephemeral error message "Command not implemented yet."
