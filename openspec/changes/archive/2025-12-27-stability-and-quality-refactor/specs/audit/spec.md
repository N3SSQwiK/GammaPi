## MODIFIED Requirements
### Requirement: Server Configuration Validation
The bot MUST be able to compare the current server configuration against a defined "Golden State".

#### Scenario: Run Audit
- **WHEN** an Admin runs `/audit`
- **THEN** the bot generates a report listing missing Roles, Channels, or incorrect Permissions, truncating the description to 4000 characters if it exceeds Discord's limits.
