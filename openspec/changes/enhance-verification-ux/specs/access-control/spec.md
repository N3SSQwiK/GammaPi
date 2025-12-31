# Access Control Specification Deltas

## MODIFIED Requirements

### Requirement: Brother Verification Flow
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
  - Don Name (optional, placeholder: "Phoenix - without 'Don' prefix")
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
  - City (required, placeholder: "New York")
  - Voucher 1 Name (required, placeholder: "Don Phoenix or John Smith")
  - Voucher 2 Name (required, placeholder: "Don Eagle or Jane Doe")

#### Scenario: Voucher name validation
- **WHEN** user enters voucher names
- **THEN** system searches brothers by don_name, first_name, last_name
- **AND** uses fuzzy matching with scoring algorithm
- **AND** validates both are existing brothers (status='BROTHER')
- **IF** no match found: reply with error showing similar names if available

## ADDED Requirements

### Requirement: Named Voucher Approval with 48-Hour Fallback
The system SHALL track named vouchers and allow any brother to approve.

#### Scenario: Approval within 48 hours
- **WHEN** a brother clicks Approve button
- **AND** approver has status='BROTHER'
- **THEN** record approval in voucher_1_id or voucher_2_id
- **Note:** Named vouchers are informational; any brother can approve within or after 48hrs

#### Scenario: Two approvals required
- **WHEN** first approval is recorded → status shows "1/2"
- **WHEN** second approval is recorded → user verified and role assigned

### Requirement: E-Board Override Command
The system SHALL provide immediate verification bypass for E-Board.

#### Scenario: /verify-override command
- **WHEN** E-Board executes `/verify-override ticket_id:ABC123`
- **THEN** validate executor has Administrator permission
- **AND** set ticket status to VERIFIED
- **AND** set user status to BROTHER
- **AND** assign 🦁 ΓΠ Brother role
- **AND** log override action

### Requirement: E-Board Chapter Assignment
The system SHALL allow E-Board to assign chapters including Omega.

#### Scenario: /chapter-assign command
- **WHEN** E-Board executes `/chapter-assign user:@Brother chapter:Omega`
- **THEN** validate executor has Administrator permission
- **AND** validate user exists with status='BROTHER'
- **AND** update user.chapter
- **AND** log action and confirm

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
  - Location: city
  - Phone: phone_number
  - Footer: "Vouchers may take up to 48 hours. After 48hrs, any brother can approve."
  - Approve button with customId: approve_ticket_{ticketId}
