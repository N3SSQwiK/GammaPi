## ADDED Requirements
### Requirement: Welcome Gate
The bot MUST present a persistent "Welcome" message in the designated entry channel with options for verification.

#### Scenario: User Joins
- **WHEN** a new user joins the server
- **THEN** they see the Welcome Gate with "Brother Verification" and "Guest Access" buttons.

### Requirement: Dual-Voucher Verification
To gain "Brother" status, an applicant MUST be approved by two distinct ΓΠ Brothers.

#### Scenario: First Vouch
- **WHEN** the first Brother clicks "Approve" on a ticket
- **THEN** the ticket status updates to "1/2 Approved" and the button remains active.

#### Scenario: Second Vouch
- **WHEN** a second, different Brother clicks "Approve"
- **THEN** the ticket status updates to "Verified", the user is granted the Brother role, and the ticket is closed.

### Requirement: Guest Access (LinkedIn Stub)
Guests MUST be able to request access via an external link.

#### Scenario: Guest Request
- **WHEN** a user clicks "Guest Access"
- **THEN** the bot sends an ephemeral message with a link to the verification portal.
