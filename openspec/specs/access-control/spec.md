# Access Control Specification

## Purpose

Define the verification and access control flows for the Gamma Pi Discord server, including server initialization, rules agreement, brother verification, and E-Board administrative functions.
## Requirements
### Requirement: Two-Step Access Control
The system MUST distinguish between "Identity Verification" and "Server Access".

#### Scenario: Rules Agreement Required First
- **WHEN** a user joins the Discord server
- **THEN** they see only `#rules-and-conduct` channel
- **AND** must click `[✅ I Agree to the Code of Conduct]` button
- **THEN** they receive `✅ Rules Accepted` role and can access `#welcome-gate`

#### Scenario: Verification Success
- **WHEN** a user passes the Dual-Voucher verification
- **THEN** they receive their Identity Role (e.g., `🦁 ΓΠ Brother`)
- **AND** gain full server access

### Requirement: Server Initialization Command
The system SHALL provide `/init` for complete server setup by the server owner.

#### Scenario: Server owner runs /init
- **WHEN** server owner executes `/init chapter:<autocomplete> industry:<autocomplete>`
- **AND** fewer than 2 brothers exist in the database
- **THEN** system runs Golden State setup (creates roles, channels with permissions)
- **AND** posts Rules embed to #rules-and-conduct
- **AND** posts Verification Gate to #welcome-gate
- **AND** shows "Light the Torch" button for founding brother registration

#### Scenario: Non-owner attempts /init
- **WHEN** a non-owner executes `/init`
- **THEN** system rejects with: "🔒 Only the server owner can use `/init`."

#### Scenario: /init disabled after threshold
- **WHEN** any user executes `/init`
- **AND** 2 or more brothers exist in the database
- **THEN** system rejects with: "⚠️ Server already initialized with {count} brothers."

#### Scenario: /init shows all chapters including hidden
- **WHEN** server owner uses chapter autocomplete in `/init`
- **THEN** ALL chapters are shown (including Omega and other hidden chapters)

#### Scenario: /init can register other users
- **WHEN** server owner executes `/init chapter:... industry:... user:@OtherUser`
- **THEN** the registration flow targets @OtherUser instead of the owner

### Requirement: Founding Brother Registration Flow
The system SHALL provide a two-modal flow for registering founding brothers during /init.

#### Scenario: Light the Torch button
- **WHEN** owner clicks "🦁 Light the Torch" button
- **THEN** system shows Modal 1 (Identity & Professional Info)

#### Scenario: Init Modal 1 - Identity fields
- **WHEN** Modal 1 is displayed for /init flow
- **THEN** it contains:
  - First Name (required)
  - Last Name (required)
  - Don Name (required)
  - Initiation Year & Semester (required, placeholder: "2015 Spring")
  - Job Title (required)

#### Scenario: Init Modal 1 submission
- **WHEN** owner submits Modal 1 with valid data
- **THEN** system shows summary embed with "Continue to Step 2" button

#### Scenario: Init Modal 2 - Contact fields
- **WHEN** owner clicks "Continue to Step 2" button
- **THEN** system shows Modal 2 with:
  - Phone Number (required)
  - City (required)

#### Scenario: Init Modal 2 submission creates founding brother
- **WHEN** owner submits Modal 2 with valid data
- **THEN** system creates user record with status='BROTHER'
- **AND** assigns 🦁 ΓΠ Brother role to target user

### Requirement: Rules Agreement Check Before Verification
The system SHALL require users to accept the Code of Conduct before starting verification.

#### Scenario: User attempts verification without rules agreement
- **WHEN** user runs `/verify-start` or clicks "🦁 I'm a Brother" button
- **AND** user does not have `✅ Rules Accepted` role
- **AND** user has no rules agreement in database
- **THEN** system rejects with: "📜 You must agree to the Code of Conduct first."

#### Scenario: Auto-restore rules role on rejoin
- **WHEN** user runs `/verify-start` or clicks verification button
- **AND** user has rules agreement recorded in database
- **AND** user does not have `✅ Rules Accepted` role (lost on server rejoin)
- **THEN** system automatically restores the `✅ Rules Accepted` role
- **AND** allows verification to proceed

### Requirement: Channel Permission Overwrites
The system SHALL configure channel permissions as part of Golden State setup.

#### Scenario: #welcome-gate permissions
- **WHEN** `/init` creates #welcome-gate
- **THEN** @everyone is denied ViewChannel
- **AND** `✅ Rules Accepted` role is allowed ViewChannel and ReadMessageHistory

#### Scenario: #verification-requests permissions
- **WHEN** `/init` creates #verification-requests
- **THEN** @everyone is denied ViewChannel
- **AND** `🦁 E-Board` role is allowed ViewChannel, ReadMessageHistory, SendMessages
- **AND** `🦁 ΓΠ Brother` role is allowed ViewChannel, ReadMessageHistory

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

### Requirement: Named Voucher Approval System with 48-Hour Fallback
The system SHALL allow named vouchers priority to approve, with fallback after 48 hours.

#### Scenario: Within 48 hours - any brother can approve
- **WHEN** a brother clicks Approve button on verification ticket
- **AND** less than 48 hours have passed since ticket creation
- **AND** approver has status='BROTHER'
- **THEN** the system records approval
- **IF** this is the first approval:
  - Update embed to show "1/2 approvals"
  - Reply: "✅ First approval recorded. One more needed."
- **IF** this is the second approval:
  - Update user status to 'BROTHER'
  - Assign 🦁 ΓΠ Brother role
  - Reply: "✅✅ Verified! {user} now has the Brother role."

#### Scenario: After 48 hours - any brother can still approve
- **WHEN** more than 48 hours have passed since ticket creation
- **AND** any brother clicks Approve
- **THEN** same approval logic applies (48hr is informational, not restrictive)

#### Scenario: E-Board override for immediate verification
- **WHEN** E-Board executes `/verify-override ticket_id:<string>`
- **THEN** validate executor has Administrator permission
- **AND** set ticket status to VERIFIED
- **AND** set user status to BROTHER
- **AND** assign 🦁 ΓΠ Brother role
- **AND** log override action

### Requirement: E-Board Omega Chapter Assignment
The system SHALL allow E-Board to assign brothers to Omega chapter (hidden from public).

#### Scenario: E-Board assigns Omega chapter
- **WHEN** E-Board executes `/chapter-assign user:@Brother chapter:Omega`
- **THEN** validates executor has Administrator permission
- **AND** validates user exists with status='BROTHER'
- **AND** updates user.chapter to 'omega'
- **AND** logs action: "{admin} assigned {user} to Omega chapter"
- **AND** replies: "✅ {user}'s chapter has been updated to Omega"

#### Scenario: Omega hidden from public dropdown
- **WHEN** `/verify-start` command shows chapter autocomplete
- **THEN** CHAPTERS with hidden=true are excluded
- **WHEN** `/chapter-assign` or `/init` command shows chapter autocomplete
- **THEN** ALL chapters including hidden ones are shown

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

