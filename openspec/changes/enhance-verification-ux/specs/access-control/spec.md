# Access Control Specification Deltas

## MODIFIED Requirements

### Requirement: Brother Verification Flow
The system SHALL provide a multi-step verification process for brothers with structured data collection and dual-voucher validation.

**[This modifies the existing single-modal verification flow to multi-step interaction]**

#### Scenario: User initiates brother verification
- **WHEN** a user clicks "Start Brother Verification" button in welcome gate
- **THEN** the system presents Chapter Selection menu (StringSelectMenu)
- **AND** menu includes all Phi Iota Alpha chapters from CHAPTERS constant where hidden=false
- **AND** menu is sorted alphabetically by Greek letter
- **AND** user selects their chapter from dropdown

#### Scenario: Chapter selection completed
- **WHEN** user selects chapter from dropdown
- **THEN** the system stores selected chapter in interaction state (encoded in customId or temp database)
- **AND** updates previous message to show "✅ Chapter: {selected_chapter}"
- **AND** presents Industry Selection menu (StringSelectMenu)
- **AND** menu includes 50 industries from INDUSTRIES constant
- **AND** placeholder text: "Select your primary industry"

#### Scenario: Industry selection completed
- **WHEN** user selects industry from dropdown
- **THEN** the system stores selected industry in interaction state
- **AND** updates previous message to show "✅ Industry: {selected_industry}"
- **AND** presents Verification Modal with remaining fields:
  - First Name (required, TextInputStyle.Short)
  - Middle Name (optional, TextInputStyle.Short)
  - Last Name (required, TextInputStyle.Short)
  - Don Name (optional, TextInputStyle.Short, label: "Don Name (your brother name - exclude 'Don')", placeholder: "e.g., Phoenix")
  - Year & Semester (required, TextInputStyle.Short, placeholder: "2010 Spring")
  - Voucher @Mentions (required, TextInputStyle.Short, placeholder: "@Brother1 @Brother2", label: "Voucher @Mentions (mention 2 ΓΠ brothers)")
  - Phone Number (required, TextInputStyle.Short, placeholder: "(555) 123-4567")
  - Zip Code or City (required, TextInputStyle.Short, placeholder: "12345 or Toronto, Canada")
  - Job Title (required, TextInputStyle.Short, placeholder: "Software Engineer")

#### Scenario: Modal submission with valid data
- **WHEN** user submits verification modal with all required fields
- **AND** year/semester matches format `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
- **AND** voucher field contains exactly 2 @mentions
- **AND** both mentioned users exist in database with status='BROTHER'
- **AND** both mentioned users are different Discord IDs
- **AND** phone number matches format `/^[\d\s\(\)\-\+\.]+$/` with minimum 10 digits
- **THEN** the system proceeds to create user profile and verification ticket

#### Scenario: Modal submission with invalid year/semester
- **WHEN** user submits modal with year/semester that doesn't match format
- **THEN** the system replies with ephemeral error:
  - "Invalid year/semester format. Please enter like: '2010 Spring' or '2015 Fall'"
  - "Valid years: 1931-2029"
- **AND** user can restart flow by clicking "Try Again" button

#### Scenario: Modal submission with invalid vouchers
- **WHEN** user submits modal with fewer than 2 @mentions
- **THEN** reply: "Please @mention exactly 2 brothers who can vouch for you"
- **WHEN** user submits modal with more than 2 @mentions
- **THEN** reply: "Please @mention exactly 2 brothers (not more)"
- **WHEN** user submits modal with @mentions of non-brothers
- **THEN** reply: "@{User} is not a verified brother. Please mention active ΓΠ brothers."
- **WHEN** user submits modal with duplicate @mentions
- **THEN** reply: "Both vouchers must be different brothers"

#### Scenario: Modal submission with invalid phone number
- **WHEN** user submits modal with phone number containing letters
- **THEN** reply: "Invalid phone number. Use digits, spaces, and symbols: () - + ."
- **WHEN** user submits modal with phone number fewer than 10 digits
- **THEN** reply: "Phone number must have at least 10 digits"

#### Scenario: User profile creation
- **WHEN** all validation passes
- **THEN** the system creates/updates user profile with:
  - discord_id: {user_id}
  - first_name, middle_name, last_name: parsed from modal
  - don_name: from modal (or null if not provided)
  - phone_number: from modal
  - chapter: from select menu state
  - initiation_year, initiation_semester: parsed from "YYYY Spring/Fall" input
  - industry: from select menu state
  - job_title: from modal
  - zip_code, city, state_province, country: derived from location field
    - IF location is 5 digits → US zip, derive city/state/timezone
    - ELSE → store as city, default country='United States'

#### Scenario: Verification ticket creation
- **WHEN** user profile is created
- **THEN** the system creates verification ticket with:
  - ticket_id: generated unique ID
  - user_id: applicant Discord ID
  - voucher_1: first @mentioned user's Discord ID
  - voucher_2: second @mentioned user's Discord ID
  - status: 'PENDING'
- **AND** replies to user: "Application submitted! Ticket ID: {ticketId}. Waiting for vouchers to approve."

#### Scenario: Voucher notification
- **WHEN** verification ticket is created
- **THEN** the system sends DM to voucher_1:
  - "You've been listed as a voucher for <@{user_id}> ({first_name} {last_name}, {chapter} {year} {semester})"
  - "Please approve in #{verification_channel} if you recognize this brother"
- **AND** sends identical DM to voucher_2
- **AND** posts verification ticket embed to VERIFICATION_CHANNEL_ID

#### Scenario: Verification ticket embed format
- **WHEN** ticket is posted to verification channel
- **THEN** embed includes fields:
  - Title: "New Verification Request"
  - User: <@{user_id}>
  - Name: {first_name} {middle_name} {last_name}
  - Don Name: {don_name} or "Not provided"
  - Chapter: {chapter}
  - Initiation: {year} {semester}
  - Vouchers: <@{voucher_1}> and <@{voucher_2}>
  - Industry: {industry}
  - Job Title: {job_title}
  - Location: {city}, {state} or {zip_code}
  - Phone: {phone_number}
  - Footer: "Vouchers will be notified to approve"
- **AND** includes Approve button with customId: `approve_ticket_{ticketId}`

## ADDED Requirements

### Requirement: Voucher-Based Approval System
The system SHALL restrict verification approvals to the two brothers listed as vouchers on each ticket.

#### Scenario: Listed voucher approves ticket
- **WHEN** a brother clicks Approve button on verification ticket
- **AND** brother's Discord ID matches ticket.voucher_1 OR ticket.voucher_2
- **THEN** the system records approval for that voucher slot
- **IF** this is the first approval (voucher_1 or voucher_2 approves):
  - Update ticket status to '1/2'
  - Reply: "✅ First approval recorded for Ticket {ticketId}. One more needed."
- **IF** this is the second approval (both vouchers approved):
  - Update user status to 'BROTHER'
  - Assign 🦁 ΓΠ Brother role
  - Reply: "✅✅ Second approval recorded! **{user}** is now verified and has the Brother role."

#### Scenario: Non-voucher attempts approval
- **WHEN** a brother clicks Approve button on verification ticket
- **AND** brother's Discord ID does NOT match ticket.voucher_1 OR ticket.voucher_2
- **THEN** the system replies (ephemeral): "Only the listed vouchers can approve this verification"
- **AND** no changes to ticket status

#### Scenario: Voucher double-approval attempt
- **WHEN** a voucher who already approved clicks Approve again
- **THEN** reply (ephemeral): "You have already approved this ticket"
- **AND** no changes to ticket status

### Requirement: E-Board Omega Chapter Assignment
The system SHALL allow E-Board to assign brothers to Omega chapter without exposing it in public verification.

#### Scenario: E-Board assigns Omega chapter
- **WHEN** E-Board executes `/chapter-assign user:@Brother chapter:Omega`
- **THEN** the system validates executor has E-Board role
- **AND** updates user.chapter to 'Omega'
- **AND** logs action: "{admin} assigned {user} to Omega chapter"
- **AND** replies: "✅ {user} chapter updated to Omega"

#### Scenario: Omega hidden from public chapter dropdown
- **WHEN** public verification flow presents Chapter Selection menu
- **THEN** the system filters CHAPTERS constant to hidden=false only
- **AND** Omega chapter is NOT displayed in menu
- **BUT** Omega exists in CHAPTERS constant with hidden=true

### Requirement: Form Validation Utilities
The system SHALL provide validation functions for all verification inputs.

#### Scenario: Validate chapter
- **WHEN** validateChapter(input) is called
- **THEN** return true if input matches any CHAPTERS.value (case-insensitive)
- **ELSE** return false

#### Scenario: Validate year/semester
- **WHEN** validateYearSemester(input) is called
- **IF** input matches `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
  - **THEN** return { year: parsed_integer, semester: 'Spring'|'Fall' }
- **ELSE** return null

#### Scenario: Validate phone number
- **WHEN** validatePhoneNumber(input) is called
- **IF** input matches `/^[\d\s\(\)\-\+\.]+$/` AND digit count >= 10
  - **THEN** return true
- **ELSE** return false

#### Scenario: Validate voucher mentions
- **WHEN** validateVoucherMentions(content, guildId) is called
- **THEN** parse Discord mention format `<@USER_ID>` from content
- **AND** extract all user IDs
- **IF** exactly 2 user IDs found:
  - Query database for both user IDs
  - IF both users have status='BROTHER' AND user IDs are different:
    - **THEN** return [voucher1_id, voucher2_id]
- **ELSE** return null (validation failed)
