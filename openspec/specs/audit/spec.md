## ADDED Requirements
### Requirement: Server Configuration Validation
The bot MUST be able to compare the current server configuration against a defined "Golden State".

#### Scenario: Run Audit
- **WHEN** an Admin runs `/audit`
- **THEN** the bot generates a report listing missing Roles, Channels, or incorrect Permissions.

### Requirement: Critical Security Checks
The audit MUST flag critical security violations immediately.

#### Scenario: Admin Leak Check
- **WHEN** the `@everyone` role has `Administrator` permission
- **THEN** the audit reports a 🔴 CRITICAL FAILURE.

### Requirement: Structural Validation
The audit MUST verify that required Forum channels and their Tags exist.

#### Scenario: Missing Forum Tags
- **WHEN** the `#career-center` forum exists but is missing the `📍 Remote` tag
- **THEN** the audit reports a ⚠️ WARNING.
