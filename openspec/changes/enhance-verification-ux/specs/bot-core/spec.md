# Bot Core Specification Deltas

## ADDED Requirements

### Requirement: Chapter Constants Management
The system SHALL maintain a hardcoded list of Phi Iota Alpha chapters with metadata for verification dropdown.

#### Scenario: Define CHAPTERS constant
- **WHEN** bot initializes or loads constants module
- **THEN** CHAPTERS constant is loaded from `src/lib/constants.ts`
- **AND** structure includes fields:
  ```typescript
  {
    value: string,        // Kebab-case ID (e.g., "gamma-pi")
    label: string,        // Display name (e.g., "Gamma Pi - Graduate Chapter")
    type: string,         // "Undergraduate" | "Graduate" | "Alumni" | "Special"
    location?: string,    // Optional location (e.g., "Troy, NY")
    hidden: boolean       // If true, excluded from public dropdown
  }
  ```

#### Scenario: Filter visible chapters for verification
- **WHEN** verification flow builds Chapter Selection menu
- **THEN** filter CHAPTERS array to hidden=false only
- **AND** sort alphabetically by Greek letter
- **AND** map to Discord select menu options format:
  ```typescript
  {
    label: CHAPTERS.label,
    value: CHAPTERS.value,
    description: CHAPTERS.location (optional)
  }
  ```

#### Scenario: Include hidden chapters for E-Board commands
- **WHEN** E-Board executes `/chapter-assign` command
- **THEN** include ALL chapters (hidden=true and hidden=false)
- **AND** allow selection of Omega chapter

#### Scenario: Validate chapter input
- **WHEN** validateChapter(input) is called
- **THEN** check if input matches any CHAPTERS.value (case-insensitive)
- **AND** return true if match found, false otherwise

### Requirement: Industry Constants Management
The system SHALL maintain a standardized list of 50 NAICS-based industries for professional categorization.

#### Scenario: Define INDUSTRIES constant
- **WHEN** bot initializes or loads constants module
- **THEN** INDUSTRIES constant is loaded from `src/lib/constants.ts`
- **AND** contains 50+ industry strings sorted alphabetically
- **AND** includes "Other (please specify in notes)" as final option
- **AND** based on NAICS taxonomy with professional naming

#### Scenario: Build industry select menu
- **WHEN** verification flow builds Industry Selection menu
- **THEN** map INDUSTRIES array to Discord select menu options:
  ```typescript
  {
    label: industry_string,
    value: industry_string
  }
  ```
- **AND** maintain alphabetical order
- **AND** "Other" option appears last

#### Scenario: Validate industry input
- **WHEN** industry value is stored or queried
- **THEN** verify value exists in INDUSTRIES array
- **OR** allow "Other" with understanding manual categorization may follow

### Requirement: Validation Utilities Module
The system SHALL provide reusable validation functions for verification form inputs.

#### Scenario: Validate year and semester input
- **WHEN** validateYearSemester(input) is called with string input
- **THEN** apply regex pattern `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
- **IF** match successful:
  - Extract year as integer (1931-2029)
  - Extract semester as capitalized string ('Spring' or 'Fall')
  - **THEN** return { year: number, semester: string }
- **IF** no match:
  - **THEN** return null

**Test Cases:**
- Input: "2010 Spring" → {year: 2010, semester: 'Spring'} ✅
- Input: "1931 Fall" → {year: 1931, semester: 'Fall'} ✅
- Input: "2030 Spring" → null ❌ (too far future)
- Input: "2010" → null ❌ (missing semester)
- Input: "2010 Winter" → null ❌ (invalid semester)

#### Scenario: Validate phone number input
- **WHEN** validatePhoneNumber(input) is called with string input
- **THEN** apply character set regex `/^[\d\s\(\)\-\+\.]+$/`
- **AND** strip non-digit characters and count digits
- **IF** character set valid AND digit count >= 10:
  - **THEN** return true
- **ELSE** return false

**Test Cases:**
- Input: "(555) 123-4567" → true ✅ (10 digits)
- Input: "+1-555-123-4567" → true ✅ (11 digits, international)
- Input: "555-CALL-NOW" → false ❌ (contains letters)
- Input: "123-4567" → false ❌ (only 7 digits)

#### Scenario: Validate zip code or city input
- **WHEN** validateZipOrCity(input) is called with string input
- **IF** input matches `/^\d{5}$/` (exactly 5 digits):
  - **THEN** return {type: 'zip', value: input}
- **ELSE**:
  - **THEN** return {type: 'city', value: input.trim()}

**Test Cases:**
- Input: "10001" → {type: 'zip', value: '10001'} ✅
- Input: "Toronto" → {type: 'city', value: 'Toronto'} ✅
- Input: "M5V 3A8" → {type: 'city', value: 'M5V 3A8'} ✅ (Canadian postal code)

#### Scenario: Validate voucher @mentions
- **WHEN** validateVoucherMentions(content, guildId) is called
- **THEN** parse Discord mention format using regex `/<@(\d+)>/g`
- **AND** extract all user IDs from mentions
- **IF** exactly 2 user IDs found:
  - Query users table for both IDs
  - Verify both have status='BROTHER'
  - Verify user IDs are different (not same person twice)
  - **IF** all checks pass:
    - **THEN** return [voucher1_id, voucher2_id]
- **ELSE** return null

**Test Cases:**
- Input: "<@123456789> <@987654321>" (both brothers, different) → ['123456789', '987654321'] ✅
- Input: "<@123456789>" (only 1 mention) → null ❌
- Input: "<@123456789> <@123456789>" (duplicate) → null ❌
- Input: "<@123456789> <@111111111>" (second is guest) → null ❌

### Requirement: Display Name Utility Module
The system SHALL provide centralized display name generation for consistent brother identity rendering.

#### Scenario: Build full display name with don name
- **WHEN** getDisplayName(user, format='full') is called
- **AND** user.don_name is not null and not empty string
- **THEN** return string formatted as "Don {don_name} ({first_name} {last_name})"
- **AND** handle null middle_name gracefully

**Examples:**
- {don_name: 'Phoenix', first_name: 'John', last_name: 'Smith'} → "Don Phoenix (John Smith)"
- {don_name: 'Nexus', first_name: 'Maria', middle_name: 'Elena', last_name: 'Garcia'} → "Don Nexus (Maria Garcia)"

#### Scenario: Build full display name without don name
- **WHEN** getDisplayName(user, format='full') is called
- **AND** user.don_name is null or empty string
- **THEN** return string formatted as "{first_name} {last_name}"

**Example:**
- {don_name: null, first_name: 'Robert', last_name: 'Johnson'} → "Robert Johnson"

#### Scenario: Build short display name
- **WHEN** getDisplayName(user, format='short') is called
- **IF** user.don_name exists:
  - **THEN** return "Don {don_name}"
- **ELSE**:
  - **THEN** return "{first_name}"

**Examples:**
- {don_name: 'Phoenix'} → "Don Phoenix"
- {don_name: null, first_name: 'Robert'} → "Robert"

#### Scenario: Build select menu label
- **WHEN** getSelectMenuLabel(user) is called for Discord dropdown
- **THEN** combine display name with industry context
- **AND** format as "{display_name} • {industry}"
- **AND** truncate if exceeds 100 characters (Discord limit)

**Examples:**
- "Don Phoenix • Technology / Software"
- "Robert Johnson • Finance / Banking / Investment"

#### Scenario: Fallback for incomplete profile
- **WHEN** getDisplayName() is called with user missing name components
- **THEN** fall back to real_name field if available
- **OR** fall back to Discord username if real_name also missing
- **AND** log warning for incomplete profile

### Requirement: Chapter Assignment Command (E-Board Only)
The system SHALL provide E-Board command to manually assign or reassign brother chapters including Omega.

#### Scenario: Execute chapter assignment command
- **WHEN** E-Board member executes `/chapter-assign user:@Brother chapter:Gamma_Pi`
- **THEN** verify executor has E-Board role
- **AND** verify target user exists and has status='BROTHER'
- **AND** update user.chapter to selected value
- **AND** log action: "{admin_id} assigned {user_id} to {chapter} at {timestamp}"
- **AND** reply: "✅ <@{user_id}> chapter updated to {chapter}"

#### Scenario: E-Board assigns Omega chapter
- **WHEN** E-Board executes `/chapter-assign user:@Brother chapter:Omega`
- **THEN** Omega appears in chapter dropdown for this command
- **AND** update proceeds normally (Omega is valid chapter value)
- **AND** user profile now shows chapter='Omega'

#### Scenario: Non-E-Board attempts chapter assignment
- **WHEN** regular brother executes `/chapter-assign`
- **THEN** command fails with error: "This command requires E-Board role"
- **AND** no changes to user profile

### Requirement: Constants Update Documentation
The system SHALL document the process for maintaining CHAPTERS and INDUSTRIES constants.

#### Scenario: Quarterly chapter list review
- **WHEN** Tech Chair performs quarterly maintenance (Jan, Apr, Jul, Oct)
- **THEN** visit phiota.org/chapters website
- **AND** compare website chapter list to CHAPTERS constant in code
- **IF** new chapter colonized:
  - Add to CHAPTERS array with appropriate metadata
  - Submit git PR with comment: "Add {chapter_name} colonized {date}"
- **IF** chapter becomes inactive:
  - Add `inactive: true` flag (keep for historical data)
  - Do NOT remove from array (preserves existing brother records)

#### Scenario: Industry taxonomy expansion request
- **WHEN** E-Board identifies >3 brothers categorized as "Other" in same field
- **THEN** review original industry descriptions
- **AND** propose new industry category if pattern emerges
- **AND** add to INDUSTRIES constant via git PR
- **AND** notify affected brothers to re-categorize

#### Scenario: Industry migration mapping
- **WHEN** new standardized industry list is deployed
- **THEN** create INDUSTRY_MIGRATION_MAP in migration script
- **AND** map common free-text variations to new standardized values
- **Example:**
  ```typescript
  {
    'Tech / Software Engineer': 'Technology / Software',
    'Software': 'Technology / Software',
    'SWE': 'Technology / Software',
    'Finance': 'Finance / Banking / Investment',
    'Law': 'Legal / Law'
  }
  ```
