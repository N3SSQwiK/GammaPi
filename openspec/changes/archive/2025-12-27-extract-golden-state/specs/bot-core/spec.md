## MODIFIED Requirements
### Requirement: Server Configuration Source
The bot MUST load its expected configuration from an external, human-readable file to facilitate easier updates and transparency.

#### Scenario: Config Loading
- **WHEN** the bot starts or the `/setup` command is run
- **THEN** it MUST read the `server-config.json` file.

## ADDED Requirements
### Requirement: Advanced Channel Configuration
The system MUST support configuring advanced channel properties to enforce community standards.

#### Scenario: Tag Enforcement
- **WHEN** the configuration specifies `requireTag: true` for a Forum
- **THEN** the `/setup` command MUST enforce this setting on the Discord channel, preventing users from posting without a tag.
