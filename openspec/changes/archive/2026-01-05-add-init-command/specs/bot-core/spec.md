# Bot Core Spec Delta: Init Command Integration

## MODIFIED Requirements

### Requirement: Server Configuration Source
The bot MUST load its expected configuration from serverConfig.ts for Golden State enforcement.

#### Scenario: Config Loading
- **WHEN** the bot starts or the `/init` command is run
- **THEN** it MUST read configuration from `serverConfig.ts`
- **AND** validate server state against expected roles, channels, and permissions

#### Scenario: Config Loading via /audit
- **WHEN** admin runs `/audit` command
- **THEN** it MUST read configuration from `serverConfig.ts`
- **AND** report discrepancies between expected and actual state

## ADDED Requirements

### Requirement: Consolidated Init Command
The system SHALL provide `/init` as the single entry point for server initialization.

#### Scenario: /init command structure
- **WHEN** server owner views `/init` command
- **THEN** command has options:
  - `chapter` (required, autocomplete, shows ALL chapters including hidden)
  - `industry` (required, autocomplete, shows 50 NAICS industries)
  - `user` (optional, User, defaults to command invoker)

#### Scenario: /init executes setup
- **WHEN** server owner runs `/init`
- **THEN** system calls `runSetup(guild)` from setupHandler
- **AND** creates any missing roles from EXPECTED_ROLES
- **AND** creates any missing channels from EXPECTED_CHANNELS
- **AND** applies permission overwrites to channels

#### Scenario: /init posts embeds
- **WHEN** setup completes successfully
- **THEN** system re-fetches guild channels (to get newly created ones)
- **AND** posts Rules embed to #rules-and-conduct
- **AND** posts Verification Gate embed to #welcome-gate
- **AND** logs each embed posting action

### Requirement: Channel Permission Overwrites Support
The system SHALL support permission overwrites in channel configuration.

#### Scenario: PermissionOverwrite interface
- **WHEN** defining channel requirements
- **THEN** `ChannelRequirement` supports `permissionOverwrites` array
- **AND** each overwrite specifies:
  - `roleOrMember`: Role name or '@everyone'
  - `allow`: Array of PermissionFlagsBits to allow
  - `deny`: Array of PermissionFlagsBits to deny

#### Scenario: Setup applies permission overwrites
- **WHEN** `runSetup()` creates a channel with permissionOverwrites
- **THEN** system resolves role names to role IDs
- **AND** applies allow/deny permission bits
- **AND** logs permission configuration

