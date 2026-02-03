# Access Control Specification Deltas

## MODIFIED Requirements

### Requirement: Multi-Step Brother Verification Flow
The system SHALL provide a multi-step verification process using slash command autocomplete and two-modal flow.

**[This replaces the single-modal verification with multi-step interaction]**

#### Implementation Details
Due to Discord API limitations:
- **Autocomplete** used instead of StringSelectMenu (Discord limits select menus to 25 options; we have 80+ chapters and 50 industries)
- **Two modals** with button between (Discord doesn't allow chaining modals directly via showModal)
- **No middle_name field** (removed per user request for simplicity)
- **Name-based voucher search** instead of @mentions (better UX for users who don't know Discord handles)

#### Scenario: User initiates brother verification
- **WHEN** a user runs `/verify-start chapter:<autocomplete> industry:<autocomplete>`
- **THEN** the system validates chapter exists in CHAPTERS (hidden=false)
- **AND** validates industry exists in INDUSTRIES
- **AND** stores selections in pendingVerifications Map
- **AND** presents Modal 1 (Identity Information)

#### Scenario: Modal 1 - Identity fields
- **WHEN** user sees Modal 1 (verify_modal_1)
- **THEN** modal contains:
  - First Name (required)
  - Last Name (required)
  - Don Name (required, placeholder: "Phoenix - without 'Don' prefix")
  - Year & Semester (required, placeholder: "2015 Spring")
  - Job Title (required)

#### Scenario: Modal 1 submission
- **WHEN** user submits Modal 1
- **THEN** system validates year/semester format
- **IF** invalid: reply with error message
- **IF** valid: reply with confirmation and "Continue to Step 2" button

#### Scenario: Modal 2 - Contact and voucher fields
- **WHEN** user clicks "Continue to Step 2" button
- **THEN** system shows Modal 2 (verify_modal_2) with:
  - Phone Number (required, placeholder: "(555) 123-4567")
  - Zip Code or City (required, placeholder: "10001 or Toronto, Canada")
  - Voucher 1 Name (required, placeholder: "Don Phoenix or John Smith")
  - Voucher 2 Name (required, placeholder: "Don Eagle or Jane Doe")

#### Scenario: Voucher name validation
- **WHEN** user enters voucher names
- **THEN** system searches brothers by don_name, first_name, last_name
- **AND** uses fuzzy matching with scoring algorithm
- **AND** validates both are existing brothers (status='BROTHER')
- **IF** no match found: reply with error showing similar names if available

## ADDED Requirements

### Requirement: Verification Ticket Embed Format
The system SHALL display comprehensive ticket information.

#### Scenario: Ticket embed fields
- **WHEN** ticket is posted to verification channel
- **THEN** embed includes:
  - Title: "🦁 New Verification Request"
  - User: Discord mention
  - Name: first_name last_name (with don_name if set)
  - Chapter: chapter label
  - Initiation: year semester
  - Named Vouchers: voucher 1 name, voucher 2 name
  - Industry: industry
  - Job Title: job_title
  - Location: zip_code or city
  - Phone: phone_number
  - Footer: "Vouchers may take up to 48 hours. After 48hrs, any brother can approve."
  - Approve button with customId: approve_ticket_{ticketId}
