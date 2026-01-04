# Bot Core Specification

## Purpose

Define the core infrastructure, constants, validation utilities, and slash commands for the FiotaBot Discord bot.

## Requirements

### Requirement: Server Configuration Source
The bot MUST load its expected configuration from serverConfig.ts for Golden State enforcement.

#### Scenario: Config Loading via /init
- **WHEN** the `/init` command is run
- **THEN** it MUST read configuration from `serverConfig.ts`
- **AND** create missing roles and channels
- **AND** apply permission overwrites to channels

#### Scenario: Config Loading via /audit
- **WHEN** admin runs `/audit` command
- **THEN** it MUST read configuration from `serverConfig.ts`
- **AND** report discrepancies between expected and actual state

### Requirement: Advanced Channel Configuration
The system MUST support configuring advanced channel properties.

#### Scenario: Tag Enforcement
- **WHEN** the configuration specifies `requireTag: true` for a Forum
- **THEN** the `/init` command MUST enforce this setting

#### Scenario: Permission Overwrites
- **WHEN** the configuration specifies `permissionOverwrites` for a channel
- **THEN** the `/init` command MUST apply these permission settings
- **AND** resolve role names to role IDs
- **AND** apply allow/deny permission bits

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
- **WHEN** /chapter-assign or /init autocomplete is built
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

### Requirement: Initialization Command
The system SHALL provide `/init` for complete server setup.

#### /init
- **Description:** Initialize server and register founding brothers (owner only)
- **Options:**
  - chapter (required, autocomplete from ALL CHAPTERS including hidden)
  - industry (required, autocomplete from INDUSTRIES)
  - user (optional, User, defaults to command invoker)
- **Flow:**
  1. Runs Golden State setup (creates roles/channels)
  2. Posts Rules embed to #rules-and-conduct
  3. Posts Verification Gate to #welcome-gate
  4. Shows "Light the Torch" button for founding brother registration
  5. Two-modal flow collects identity and contact info
  6. Creates user record and assigns Brother role
- **Guards:**
  - Only server owner can use
  - Disabled after 2+ brothers exist

### Requirement: Verification Commands
The system SHALL provide commands for the verification flow.

#### /verify
- **Description:** Post verification gate embed (admin only)
- **Usage:** Run in any channel (typically #welcome-gate)
- **Action:** Posts embed with "🚀 Get Verified" button
- **Note:** This is a repair command; /init posts this automatically

#### /rules
- **Description:** Post Code of Conduct embed (admin only)
- **Usage:** Run in any channel (typically #rules-and-conduct)
- **Action:** Posts rules embed with "✅ I Agree" button
- **Note:** This is a repair command; /init posts this automatically

#### /verify-start
- **Description:** Start brother verification process
- **Options:**
  - chapter (required, autocomplete from CHAPTERS where hidden=false)
  - industry (required, autocomplete from INDUSTRIES)
- **Flow:** Checks rules → Validates inputs → Modal 1 → Button → Modal 2 → Ticket creation

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
