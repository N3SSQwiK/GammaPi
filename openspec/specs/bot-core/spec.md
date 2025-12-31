# Bot Core Specification

## Core Requirements

### Requirement: Server Configuration Source
The bot MUST load its expected configuration from serverConfig.ts for Golden State enforcement.

#### Scenario: Config Loading
- **WHEN** the bot starts or the `/setup` command is run
- **THEN** it MUST read configuration from `serverConfig.ts`
- **AND** validate server state against expected roles, channels, and permissions

### Requirement: Advanced Channel Configuration
The system MUST support configuring advanced channel properties.

#### Scenario: Tag Enforcement
- **WHEN** the configuration specifies `requireTag: true` for a Forum
- **THEN** the `/setup` command MUST enforce this setting

## Constants Management

### Requirement: Chapter Constants
The system SHALL maintain a list of Phi Iota Alpha chapters with metadata.

#### Scenario: CHAPTERS constant structure
- **WHEN** bot loads constants from `src/lib/constants.ts`
- **THEN** CHAPTERS array contains 80+ chapter entries with:
  ```typescript
  {
    value: string,        // Kebab-case ID (e.g., "gamma-pi")
    label: string,        // Display name (e.g., "Gamma Pi - Graduate Chapter")
    institution?: string, // University name (optional)
    state?: string,       // State/location (optional)
    type: string,         // "Undergraduate" | "Graduate" | "Alumni" | "Special"
    hidden: boolean       // If true, excluded from public autocomplete
  }
  ```

#### Scenario: Omega chapter hidden
- **WHEN** verification autocomplete is built
- **THEN** Omega chapter (hidden=true) is excluded
- **WHEN** /chapter-assign autocomplete is built (E-Board)
- **THEN** ALL chapters including Omega are shown

### Requirement: Industry Constants
The system SHALL maintain 50 NAICS-based industry categories.

#### Scenario: INDUSTRIES constant
- **WHEN** bot loads constants
- **THEN** INDUSTRIES array contains 50 industry strings
- **AND** includes "Other" as final option
- **AND** sorted alphabetically

## Validation Utilities

### Requirement: Validation Functions Module
The system SHALL provide `src/lib/validation.ts` with reusable validators.

#### Scenario: Validate year/semester
- **WHEN** validateYearSemester(input) is called
- **IF** input matches `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
  - **THEN** return { year: number, semester: string }
- **ELSE** return null

**Test Cases:**
- "2010 Spring" → {year: 2010, semester: 'Spring'} ✅
- "1931 Fall" → {year: 1931, semester: 'Fall'} ✅
- "2030 Spring" → null ❌ (too far future)
- "2010" → null ❌ (missing semester)

#### Scenario: Validate phone number
- **WHEN** validatePhoneNumber(input) is called
- **IF** only contains digits/spaces/()-.+ AND digit count >= 10
  - **THEN** return true
- **ELSE** return false

**Test Cases:**
- "(555) 123-4567" → true ✅
- "+1-555-123-4567" → true ✅
- "555-CALL-NOW" → false ❌ (contains letters)

#### Scenario: Validate voucher name search
- **WHEN** parseVoucherSearch(input) is called
- **THEN** parse input to search terms
- **AND** calculateNameMatchScore() returns fuzzy match score
- **AND** searchBrothersByName() finds matching brothers

## Display Name Utilities

### Requirement: Display Name Builder Module
The system SHALL provide `src/lib/displayNameBuilder.ts` for consistent name rendering.

#### Scenario: Full display name with don name
- **WHEN** getDisplayName(user, 'full') with don_name set
- **THEN** return "Don {don_name} ({first_name} {last_name})"

#### Scenario: Full display name without don name
- **WHEN** getDisplayName(user, 'full') without don_name
- **THEN** return "{first_name} {last_name}"

#### Scenario: Short display name
- **WHEN** getDisplayName(user, 'short')
- **IF** don_name exists → return "Don {don_name}"
- **ELSE** return "{first_name}"

## Slash Commands

### Requirement: Verification Commands
The system SHALL provide commands for the verification flow.

#### /verify
- **Description:** Post verification gate embed (admin only)
- **Usage:** Run in `#welcome-gate` channel
- **Action:** Posts embed with Brother/Guest verification options

#### /verify-start
- **Description:** Start brother verification process
- **Options:**
  - chapter (required, autocomplete from CHAPTERS where hidden=false)
  - industry (required, autocomplete from INDUSTRIES)
- **Flow:** Validates inputs → Modal 1 → Button → Modal 2 → Ticket creation

#### /verify-override
- **Description:** E-Board immediate verification override
- **Permission:** Administrator
- **Options:**
  - ticket_id (required, string)
- **Action:** Immediately verifies the ticket without voucher approval

#### /chapter-assign
- **Description:** E-Board assign chapter to brother
- **Permission:** Administrator
- **Options:**
  - user (required, User)
  - chapter (required, autocomplete from ALL CHAPTERS including hidden)
- **Action:** Updates user.chapter in database

#### /profile-update
- **Description:** Update your profile information
- **Action:** Shows modal with current values for don_name, phone_number, job_title, city
- **Restriction:** Only works for existing users in database

## Autocomplete Helpers

### Requirement: Autocomplete Implementation
The system SHALL provide autocomplete for large option lists.

#### Scenario: Chapter autocomplete
- **WHEN** user types in chapter option
- **THEN** searchChapters(query) filters by label/value
- **AND** returns top 25 matches (Discord limit)
- **AND** getVerificationChapters() excludes hidden chapters

#### Scenario: Industry autocomplete
- **WHEN** user types in industry option
- **THEN** searchIndustries(query) filters by name
- **AND** returns top 25 matches
