## MODIFIED Requirements
### Requirement: Dual-Voucher Verification
To gain "Brother" status, an applicant MUST be approved by two distinct ΓΠ Brothers.

#### Scenario: Second Vouch
- **WHEN** a second, different Brother clicks "Approve"
- **THEN** the system MUST use a database transaction to verify the state, update the status to "Verified", AND grant the `🦁 ΓΠ Brother` role to the user on Discord.

### Requirement: Admin Notification
The bot MUST notify the leadership team when a new application is submitted.

#### Scenario: Application Submitted
- **WHEN** a user submits the "Brother Application" modal
- **THEN** the bot MUST fetch the configured `VERIFICATION_CHANNEL_ID` and post an interactive Ticket Embed.
