# Identity Specification Deltas

## MODIFIED Requirements

### Requirement: User Profile Data Model
The system SHALL store comprehensive brother identity information.

**[This expands the existing users table schema]**

#### Implementation Details
- **No middle_name field** (removed per user request for simplicity)
- **real_name deprecated** (not auto-computed; use first_name + last_name instead)
- **Name-based voucher search** requires first_name, last_name, don_name fields

#### Scenario: Store brother profile with complete identity
- **WHEN** user profile is created or updated
- **THEN** the system stores:
  - **Identity:** discord_id (primary key)
  - **Name:** first_name, last_name, don_name
  - **Fraternity:** chapter, initiation_year, initiation_semester
  - **Contact:** phone_number
  - **Professional:** industry, job_title
  - **Location:** city, state_province, country
  - **Metadata:** status, rules_agreed_at

#### Scenario: Query brother by name for voucher search
- **WHEN** system needs to find brother by name
- **THEN** search across first_name, last_name, don_name
- **AND** use fuzzy matching with scoring:
  - Exact match on don_name: highest priority
  - Exact match on first_name + last_name: high priority
  - Partial matches: lower scores based on similarity

## ADDED Requirements

### Requirement: Brother Name Display System
The system SHALL prioritize don names in all displays.

#### Scenario: Display name generation
- **WHEN** getDisplayName(user, format) is called
- **IF** format='full' AND don_name exists → "Don {don_name} ({first_name} {last_name})"
- **IF** format='full' AND no don_name → "{first_name} {last_name}"
- **IF** format='short' AND don_name exists → "Don {don_name}"
- **IF** format='short' AND no don_name → "{first_name}"

### Requirement: Chapter Affiliation Tracking
The system SHALL record chapter membership from verification.

#### Scenario: Store chapter affiliation
- **WHEN** brother is verified
- **THEN** store chapter (from CHAPTERS constant value)
- **AND** store initiation_year (1931-2029)
- **AND** store initiation_semester ('Spring' or 'Fall')

### Requirement: Profile Update Command
The system SHALL allow brothers to update their profile.

#### Scenario: /profile-update command
- **WHEN** brother runs `/profile-update`
- **THEN** show modal pre-filled with current values:
  - Don Name
  - Phone Number
  - Job Title
  - City
- **AND** update database on submission

## Deprecated

### real_name Field
The real_name field is deprecated and should not be used:
- Use first_name + last_name for display
- Use getDisplayName() utility for formatted output
- Existing queries using real_name should be migrated
