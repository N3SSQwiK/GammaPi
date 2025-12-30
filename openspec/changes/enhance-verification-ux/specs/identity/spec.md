# Identity Specification Deltas

## MODIFIED Requirements

### Requirement: User Profile Data Model
The system SHALL store comprehensive brother identity information including name components, contact details, fraternity context, and location data.

**[This expands the existing users table schema]**

#### Scenario: Store brother profile with complete identity
- **WHEN** user profile is created or updated
- **THEN** the system stores following fields in users table:
  - **Identity:** discord_id (primary key)
  - **Legal Name:** first_name, middle_name, last_name
  - **Fraternity Identity:** don_name, chapter, initiation_year, initiation_semester
  - **Contact:** phone_number, linked_in_id
  - **Professional:** industry, job_title, is_mentor
  - **Location:** zip_code, city, state_province, country
  - **Metadata:** status, vouched_by, location_meta (JSON)
- **AND** computes real_name as concatenation: first_name + middle_name + last_name

#### Scenario: Query brother by name components
- **WHEN** system needs to search brothers by name
- **THEN** search across first_name, last_name, don_name fields
- **AND** support queries like "Find brother with first_name='John'"
- **OR** "Find brother with don_name='Phoenix'"

## ADDED Requirements

### Requirement: Brother Name Display System
The system SHALL prioritize don names in all brother displays while maintaining legal name accessibility.

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
- **AND** user.don_name is not null
- **THEN** return "Don {don_name}"
- **WHEN** user.don_name is null
- **THEN** return "{first_name}"

#### Scenario: Generate select menu label
- **WHEN** getSelectMenuLabel(user) is called for Discord select menu option
- **THEN** return "{display_name} • {industry}" if don_name exists
- **OR** return "{first_name} {last_name} • {industry}" if no don_name
- **AND** format is optimized for readability in dropdown (60 char max)
- **Example:** "Don Phoenix • Technology / Software"

#### Scenario: Display name in Discord embed
- **WHEN** brother is featured in embed (verification ticket, spotlight, etc.)
- **THEN** embed title or name field shows full display name
- **AND** additional context fields can show legal name separately if needed
- **Example Embed:**
  - Title: "Brother Profile: Don Phoenix"
  - Field "Legal Name": "John Michael Smith"

### Requirement: International Address Support
The system SHALL support both US zip codes and international city-based locations.

#### Scenario: Parse US zip code location
- **WHEN** validateZipOrCity(input) receives 5-digit input (e.g., "10001")
- **THEN** classify as type='zip'
- **AND** derive city, state_province, timezone using zipToLocation utility
- **AND** set country='United States'
- **AND** store zip_code, city, state_province, country in user profile

#### Scenario: Parse international city location
- **WHEN** validateZipOrCity(input) receives non-5-digit input (e.g., "Toronto")
- **THEN** classify as type='city'
- **AND** store input as city field
- **AND** default country='United States' (prompt user for clarification if international)
- **AND** state_province and zip_code remain null

#### Scenario: International brother with postal code
- **WHEN** user enters Canadian postal code (e.g., "M5V 3A8")
- **THEN** system stores as city field (no US zip derivation)
- **AND** user can manually update country to 'Canada' via profile command
- **AND** location_meta JSON can store {postal_code: "M5V 3A8", country: "Canada"}

#### Scenario: Display location in profile
- **WHEN** brother location is displayed (in /find, profiles, etc.)
- **IF** zip_code exists:
  - **THEN** show "{city}, {state_province}" (derived from zip)
  - **Example:** "New York, NY"
- **IF** only city exists:
  - **THEN** show "{city}, {country}" if country != 'United States'
  - **OR** show "{city}" if country = 'United States'
  - **Example:** "Toronto, Canada" or "Los Angeles"

### Requirement: Chapter Affiliation Tracking
The system SHALL record and display brother chapter membership and initiation details.

#### Scenario: Store chapter affiliation
- **WHEN** brother profile is created via verification
- **THEN** store chapter (Greek letter designation, e.g., "Gamma Pi")
- **AND** store initiation_year (integer, 1931-2029)
- **AND** store initiation_semester ('Spring' or 'Fall')

#### Scenario: Display chapter in profile
- **WHEN** brother profile is shown (embed, select menu, etc.)
- **THEN** format as "{chapter} {semester} '{year_short}"
- **Example:** "Gamma Pi Spring '10" (for 2010)
- **OR** "Alpha Fall '95" (for 1995)

#### Scenario: Query brothers by chapter
- **WHEN** system needs to find brothers from specific chapter
- **THEN** query users table WHERE chapter = {target_chapter}
- **AND** optionally filter by initiation_year range
- **Example:** Find all Gamma Pi brothers who crossed 2015-2020

### Requirement: Phone Number Contact Information
The system SHALL collect and store brother phone numbers in flexible international format.

#### Scenario: Store phone number
- **WHEN** phone number is validated and stored
- **THEN** store exactly as user entered (preserve formatting)
- **AND** support formats: "(555) 123-4567", "+1-555-123-4567", "+52 123 456 7890"
- **AND** do not normalize or reformat

#### Scenario: Display phone number
- **WHEN** phone number is shown in profile or contact list
- **THEN** display exactly as stored
- **AND** clickable link format in Discord: `tel:{phone_number}` (if supported)

#### Scenario: Phone number privacy
- **WHEN** brother profile is viewed by different user types
- **THEN** phone number visibility follows privacy rules:
  - E-Board: Always visible
  - Brothers (status='BROTHER'): Visible
  - Guests/Candidates: Hidden
- **Future:** `/profile-privacy` command to set custom visibility

### Requirement: Real Name Computed Field
The system SHALL auto-compute real_name from name components for backward compatibility.

#### Scenario: Auto-compute real_name on insert
- **WHEN** new user profile is inserted with first_name, middle_name, last_name
- **THEN** database trigger auto-computes real_name:
  - Concatenate: first_name + ' ' + middle_name + ' ' + last_name
  - Strip extra spaces if middle_name is null
- **AND** stores in real_name field

#### Scenario: Auto-compute real_name on update
- **WHEN** user profile is updated and any name component changes
- **THEN** database trigger re-computes real_name
- **AND** updates real_name field atomically

#### Scenario: Query by real_name (legacy support)
- **WHEN** existing code queries WHERE real_name LIKE '%Smith%'
- **THEN** query still works (real_name exists and is current)
- **AND** no breaking changes to existing queries

## Data Migration

### Requirement: Backfill Name Components from Existing real_name
The system SHALL parse existing real_name values into first/middle/last components.

#### Scenario: Parse three-part name
- **WHEN** existing user has real_name = "John Michael Smith"
- **THEN** backfill script splits on spaces:
  - first_name = "John"
  - middle_name = "Michael"
  - last_name = "Smith"

#### Scenario: Parse two-part name
- **WHEN** existing user has real_name = "Maria Garcia"
- **THEN** backfill script splits:
  - first_name = "Maria"
  - middle_name = null
  - last_name = "Garcia"

#### Scenario: Parse single name (ambiguous)
- **WHEN** existing user has real_name = "Phoenix"
- **THEN** backfill script logs ambiguity:
  - first_name = "Phoenix"
  - last_name = null
  - Flagged for E-Board manual review

#### Scenario: Parse hyphenated or suffixed names
- **WHEN** existing user has real_name = "Mary-Jane Smith Jr"
- **THEN** backfill script uses heuristics:
  - first_name = "Mary-Jane" (keep hyphen)
  - middle_name = null
  - last_name = "Smith Jr" (keep suffix)
  - Flagged for E-Board verification

### Requirement: Migrate Industry Free-Text to Standardized Values
The system SHALL map existing free-text industry values to standardized INDUSTRIES list.

#### Scenario: Map common variations
- **WHEN** existing user has industry = "Tech / Software Engineer"
- **THEN** migration script maps to "Technology / Software"
- **WHEN** existing user has industry = "Finance"
- **THEN** migration script maps to "Finance / Banking / Investment"

#### Scenario: Unmapped industry value
- **WHEN** existing user has industry = "Blockchain Consultant"
- **AND** no direct mapping exists in INDUSTRY_MIGRATION_MAP
- **THEN** migration script:
  - Sets industry = "Other"
  - Logs original value for E-Board review
  - E-Board manually categorizes or adds new industry to INDUSTRIES constant
