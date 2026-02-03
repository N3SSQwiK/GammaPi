# Bot Core Specification Deltas

## ADDED Requirements

### Requirement: Chapter Constants Management
The system SHALL maintain 80+ Phi Iota Alpha chapters in `src/lib/constants.ts`.

#### Implementation
```typescript
interface Chapter {
  value: string;        // Kebab-case ID (e.g., "gamma-pi")
  label: string;        // Display name (e.g., "Gamma Pi - Graduate Chapter")
  institution?: string; // University name
  state?: string;       // State/location
  type: string;         // "Undergraduate" | "Graduate" | "Alumni" | "Special"
  hidden: boolean;      // If true, excluded from public autocomplete
}
```

#### Scenario: Autocomplete instead of select menu
- **Note:** Discord limits select menus to 25 options. With 80+ chapters, we use autocomplete instead.
- **WHEN** /verify-start command is used
- **THEN** chapter option uses autocomplete via searchChapters(query)
- **AND** returns top 25 matches

#### Scenario: Filter visible chapters for verification
- **WHEN** verification autocomplete is built
- **THEN** use getVerificationChapters() which filters hidden=false

#### Scenario: Include hidden chapters for E-Board
- **WHEN** /chapter-assign autocomplete is built
- **THEN** include ALL chapters (hidden=true and hidden=false)

#### Scenario: Omega chapter
- Omega chapter has hidden=true
- Only visible in /chapter-assign (E-Board only)
- Used for deceased brothers (memorial designation)

### Requirement: Industry Constants Management
The system SHALL maintain 50 NAICS-based industries.

#### Implementation
- INDUSTRIES array contains 50 industry strings
- Sorted alphabetically
- "Other" as final option
- searchIndustries(query) for autocomplete filtering

### Requirement: Validation Utilities Module
The system SHALL provide `src/lib/validation.ts`.

#### Functions Implemented
- **validateYearSemester(input)** → {year, semester} | null
  - Regex: `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
  - Year range: 1931-2029
- **validatePhoneNumber(input)** → boolean
  - Must be digits/spaces/()-.+ only
  - Minimum 10 digits
- **validateZipOrCity(input)** → {type: 'zip'|'city', value}
  - 5 digits → zip
  - Otherwise → city
- **parseVoucherSearch(input)** → search terms
- **calculateNameMatchScore(name, query)** → number
  - Fuzzy matching for voucher name search

#### Scenario: Name-based voucher search (replaces @mentions)
- **WHEN** user enters voucher name in Modal 2
- **THEN** system searches brothers by don_name, first_name, last_name
- **AND** uses fuzzy matching with scoring
- **Note:** @mentions were replaced with name search for better UX

### Requirement: Display Name Utility Module
The system SHALL provide `src/lib/displayNameBuilder.ts`.

#### Functions Implemented
- **getDisplayName(user, format)** → formatted name string
  - format='full' with don_name: "Don {don_name} ({first_name} {last_name})"
  - format='full' without don_name: "{first_name} {last_name}"
  - format='short' with don_name: "Don {don_name}"
  - format='short' without don_name: "{first_name}"
- **getSelectMenuLabel(user)** → "Name • Industry" format
- **formatChapterName(chapter)** → friendly chapter name

### Requirement: Autocomplete Helpers
The system SHALL provide autocomplete search functions in constants.ts.

#### Functions Implemented
- **searchChapters(query)** → filtered chapters (max 25)
- **searchIndustries(query)** → filtered industries (max 25)
- **getVerificationChapters()** → chapters where hidden=false
- **isValidChapter(value)** → boolean
- **isValidIndustry(value)** → boolean

### Requirement: Verification Slash Commands
The system SHALL provide slash commands for the enhanced verification flow.

#### Scenario: /verify-start command
- **WHEN** user runs `/verify-start chapter:<autocomplete> industry:<autocomplete>`
- **THEN** system validates chapter and industry
- **AND** stores selections in pendingVerifications Map
- **AND** presents Modal 1 (Identity Information)
- **Note:** Uses two modals because Discord doesn't allow chaining modals

#### Scenario: /verify-override command
- **WHEN** E-Board runs `/verify-override ticket_id:<string>`
- **AND** executor has Administrator permission
- **THEN** system immediately verifies without voucher approvals

#### Scenario: /chapter-assign command
- **WHEN** E-Board runs `/chapter-assign user:<User> chapter:<autocomplete>`
- **AND** executor has Administrator permission
- **THEN** system updates user.chapter in database
- **Note:** Autocomplete includes ALL chapters (including hidden Omega)

#### Scenario: /profile-update command
- **WHEN** existing user runs `/profile-update`
- **THEN** system shows modal with current values for don_name, phone_number, job_title, city
- **AND** user can update their profile information

### Requirement: Modal Handlers
The system SHALL handle verification modals in accessHandler.ts.

#### Modal IDs
- **verify_modal_1** → Identity fields (first step)
- **verify_modal_2** → Contact and voucher fields (second step)
- **profile_update_modal** → Profile update fields

#### Button IDs
- **verify_continue_{ticketId}** → Shows Modal 2 after Modal 1

#### Why Two Modals?
Discord API limitation: Cannot call showModal() from a ModalSubmitInteraction.
Solution: Modal 1 → Reply with button → Button click → Modal 2

### Requirement: Pending Verifications State
The system SHALL maintain in-memory state for multi-step verification.

#### Implementation
```typescript
const pendingVerifications = new Map<string, {
  chapter: string;
  industry: string;
  firstName: string;
  lastName: string;
  donName: string;
  yearSemester: string;
  jobTitle: string;
}>();
```
- Key: Discord user ID
- Cleared after Modal 2 submission or timeout

### Requirement: Constants Maintenance Documentation
The system SHALL document quarterly maintenance process.

#### Chapter List Review (Quarterly)
- **Schedule:** First week of Jan, Apr, Jul, Oct
- **Process:**
  1. Visit phiota.org/chapters
  2. Compare with CHAPTERS constant
  3. Add new chapters with hidden=false
  4. Mark inactive chapters (don't delete)
  5. Deploy changes

#### Industry Expansion
- **Trigger:** >3 brothers select "Other" for same field
- **Process:**
  1. Query database for "Other" selections
  2. Identify patterns
  3. Add new industry to INDUSTRIES
  4. Deploy changes
