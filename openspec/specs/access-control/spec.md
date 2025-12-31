# Access Control Specification

## Core Requirements

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

### Requirement: Multi-Step Brother Verification Flow
The system SHALL provide a multi-step verification process with autocomplete and two-modal flow.

#### Scenario: User initiates brother verification
- **WHEN** a user runs `/verify-start` command
- **THEN** the system shows autocomplete for `chapter` option (80+ chapters)
- **AND** shows autocomplete for `industry` option (50 industries)
- **AND** validates selections against CHAPTERS and INDUSTRIES constants
- **AND** presents Modal 1 (Identity Information)

#### Scenario: Modal 1 - Identity Information
- **WHEN** user completes autocomplete selections
- **THEN** system shows Modal 1 with fields:
  - First Name (required)
  - Last Name (required)
  - Don Name (optional, placeholder: "Phoenix - without 'Don' prefix")
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
  - City (required, placeholder: "New York")
  - Voucher 1 Name (required, placeholder: "Don Phoenix or John Smith")
  - Voucher 2 Name (required, placeholder: "Don Eagle or Jane Doe")

#### Scenario: Voucher name search
- **WHEN** user enters voucher names in Modal 2
- **THEN** system searches brothers by:
  - don_name (exact or partial match)
  - first_name + last_name combination
  - Fuzzy matching with scoring algorithm
- **AND** validates both vouchers are existing brothers (status='BROTHER')

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
- **WHEN** E-Board executes `/verify-override ticket_id`
- **THEN** system immediately verifies the user
- **AND** bypasses voucher approval requirement
- **AND** logs override action

### Requirement: E-Board Omega Chapter Assignment
The system SHALL allow E-Board to assign brothers to Omega chapter (hidden from public).

#### Scenario: E-Board assigns Omega chapter
- **WHEN** E-Board executes `/chapter-assign user:@Brother chapter:Omega`
- **THEN** validates executor has Administrator permission
- **AND** updates user.chapter to 'omega'
- **AND** logs action: "{admin} assigned {user} to Omega chapter"
- **AND** replies: "✅ {user}'s chapter has been updated to Omega"

#### Scenario: Omega hidden from public dropdown
- **WHEN** `/verify-start` command shows chapter autocomplete
- **THEN** CHAPTERS with hidden=true are excluded
- **WHEN** `/chapter-assign` command shows chapter autocomplete
- **THEN** ALL chapters including hidden ones are shown (E-Board only)
