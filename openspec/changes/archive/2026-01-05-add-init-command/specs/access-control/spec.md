# Access Control Spec Delta: Init Command & Verification Updates

## ADDED Requirements

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
- **Note:** This differs from `/verify-start` which excludes hidden chapters

#### Scenario: /init can register other users
- **WHEN** server owner executes `/init chapter:... industry:... user:@OtherUser`
- **THEN** the registration flow targets @OtherUser instead of the owner
- **AND** owner still clicks "Light the Torch" and fills modals on behalf of target

### Requirement: Founding Brother Registration Flow
The system SHALL provide a two-modal flow for registering founding brothers during /init.

#### Scenario: Light the Torch button
- **WHEN** owner clicks "🦁 Light the Torch" button
- **THEN** system shows Modal 1 (Identity & Professional Info)

#### Scenario: Modal 1 - Identity fields
- **WHEN** Modal 1 is displayed
- **THEN** it contains:
  - First Name (required)
  - Last Name (required)
  - Don Name (required)
  - Initiation Year & Semester (required, placeholder: "2015 Spring")
  - Job Title (required)

#### Scenario: Modal 1 submission
- **WHEN** owner submits Modal 1 with valid data
- **THEN** system shows summary embed with "Continue to Step 2" button
- **Note:** Discord does not allow chaining modals directly

#### Scenario: Modal 2 - Contact fields
- **WHEN** owner clicks "Continue to Step 2" button
- **THEN** system shows Modal 2 with:
  - Phone Number (required)
  - City (required)

#### Scenario: Modal 2 submission creates founding brother
- **WHEN** owner submits Modal 2 with valid data
- **THEN** system creates user record with status='BROTHER'
- **AND** assigns 🦁 ΓΠ Brother role to target user
- **AND** shows success embed: "Welcome to the Pride, Founding Lion!"

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

### Requirement: Channel Permission Overwrites in Golden State
The system SHALL configure channel permissions as part of Golden State setup.

#### Scenario: #welcome-gate permissions
- **WHEN** `/init` or `/setup` creates #welcome-gate
- **THEN** @everyone is denied ViewChannel
- **AND** `✅ Rules Accepted` role is allowed ViewChannel and ReadMessageHistory

#### Scenario: #verification-requests permissions
- **WHEN** `/init` or `/setup` creates #verification-requests
- **THEN** @everyone is denied ViewChannel
- **AND** `🦁 E-Board` role is allowed ViewChannel, ReadMessageHistory, SendMessages
- **AND** `🦁 ΓΠ Brother` role is allowed ViewChannel, ReadMessageHistory

## MODIFIED Requirements

### Requirement: Multi-Step Brother Verification Flow
The system SHALL provide a multi-step verification process with autocomplete and two-modal flow.

#### Scenario: User initiates brother verification
- **WHEN** a user runs `/verify-start` command
- **THEN** the system checks rules agreement first (see Rules Agreement Check)
- **AND** shows autocomplete for `chapter` option (80+ chapters, hidden excluded)
- **AND** shows autocomplete for `industry` option (50 industries)
- **AND** validates selections against CHAPTERS and INDUSTRIES constants
- **AND** presents Modal 1 (Identity Information)

#### Scenario: Modal 1 - Identity Information
- **WHEN** user completes autocomplete selections
- **THEN** system shows Modal 1 with fields:
  - First Name (required)
  - Last Name (required)
  - Don Name (required)
  - Year & Semester (required, placeholder: "2015 Spring")
  - Job Title (required)
- **AND** validates year/semester format on submission

#### Scenario: Modal 1 submission shows continuation button
- **WHEN** user submits Modal 1 successfully
- **THEN** system replies with ephemeral message showing collected info
- **AND** includes "Continue to Step 2" button
- **Note:** Discord does not allow chaining modals directly; button is required

#### Scenario: Modal 2 - Contact and Vouchers
- **WHEN** user clicks "Continue to Step 2" button
- **THEN** system shows Modal 2 with fields:
  - Phone Number (required, placeholder: "(555) 123-4567")
  - Zip Code or City (required, placeholder: "10001 or Toronto, Canada")
  - Voucher 1 Name (required, placeholder: "Don Phoenix or John Smith")
  - Voucher 2 Name (required, placeholder: "Don Eagle or Jane Doe")

#### Scenario: Voucher name search
- **WHEN** user enters voucher names in Modal 2
- **THEN** system searches brothers by:
  - don_name (exact or partial match)
  - first_name + last_name combination
  - Fuzzy matching with scoring algorithm
- **AND** validates both vouchers are existing brothers (status='BROTHER')

