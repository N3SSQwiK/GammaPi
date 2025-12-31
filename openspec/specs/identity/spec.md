# Identity Specification

## Core Requirements

### Requirement: User Profile Data Model
The system SHALL store comprehensive brother identity information including name components, contact details, fraternity context, and location data.

#### Scenario: Store brother profile with complete identity
- **WHEN** user profile is created or updated
- **THEN** the system stores following fields in users table:
  - **Identity:** discord_id (primary key)
  - **Name:** first_name, last_name, don_name (brother name)
  - **Fraternity:** chapter, initiation_year, initiation_semester
  - **Contact:** phone_number, linked_in_id
  - **Professional:** industry, job_title, is_mentor
  - **Location:** city, state_province, country, zip_code, timezone
  - **Metadata:** status, rules_agreed_at

**Note:** middle_name field was removed for simplicity. real_name field is deprecated.

#### Scenario: Query brother by name
- **WHEN** system needs to search brothers by name
- **THEN** search across first_name, last_name, don_name fields
- **AND** support fuzzy matching with scoring algorithm
- **Examples:**
  - "Find brother with first_name='John'"
  - "Find brother with don_name='Phoenix'"

### Requirement: Brother Name Display System
The system SHALL prioritize don names in all brother displays.

#### Scenario: Generate display name for brother with don name
- **WHEN** getDisplayName(user, format='full') is called
- **AND** user.don_name is not null
- **THEN** return "Don {don_name} ({first_name} {last_name})"
- **Example:** "Don Phoenix (John Smith)"

#### Scenario: Generate display name for brother without don name
- **WHEN** getDisplayName(user, format='full') is called
- **AND** user.don_name is null
- **THEN** return "{first_name} {last_name}"
- **Example:** "Robert Johnson"

#### Scenario: Generate short display name
- **WHEN** getDisplayName(user, format='short') is called
- **IF** user.don_name is not null → return "Don {don_name}"
- **ELSE** return "{first_name}"

#### Scenario: Generate select menu label
- **WHEN** getSelectMenuLabel(user) is called for Discord select menu
- **THEN** return "{display_name} • {industry}"
- **AND** truncate if exceeds 100 characters
- **Example:** "Don Phoenix • Technology / Software"

### Requirement: Chapter Affiliation Tracking
The system SHALL record and display brother chapter membership.

#### Scenario: Store chapter affiliation
- **WHEN** brother profile is created via verification
- **THEN** store chapter (value from CHAPTERS constant)
- **AND** store initiation_year (integer, 1931-2029)
- **AND** store initiation_semester ('Spring' or 'Fall')

#### Scenario: Display chapter in profile
- **WHEN** brother profile is shown
- **THEN** format as "{chapter} {semester} '{year_short}"
- **Example:** "Gamma Pi Spring '10"

### Requirement: Phone Number Contact Information
The system SHALL collect and store brother phone numbers.

#### Scenario: Store phone number
- **WHEN** phone number is validated and stored
- **THEN** store exactly as user entered (preserve formatting)
- **AND** support formats: "(555) 123-4567", "+1-555-123-4567", "+52 123 456 7890"

#### Scenario: Phone number privacy
- **WHEN** brother profile is viewed
- **THEN** phone number visibility:
  - E-Board: Always visible
  - Brothers (status='BROTHER'): Visible
  - Guests/Candidates: Hidden

### Requirement: Profile Update Command
The system SHALL allow brothers to update their profile information.

#### Scenario: Brother updates profile
- **WHEN** brother executes `/profile-update`
- **THEN** system shows modal with pre-filled values:
  - Don Name (current value or empty)
  - Phone Number (current value or empty)
  - Job Title (current value or empty)
  - City (current value or empty)
- **AND** updates database on submission
- **AND** confirms changes with ephemeral reply
