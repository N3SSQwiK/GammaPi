## ADDED Requirements
### Requirement: Line Identity Management
The bot MUST be able to assign and manage historical "Line" roles to Brothers.

#### Scenario: Line Crossing (Bulk Promotion)
- **WHEN** the Dean runs `/cross @User1 @User2 line:Beta semester:"Spring 2026"`
- **THEN** the users are promoted from "Candidate" to "Brother", and the "Beta Line" role is created (if missing) and assigned.

### Requirement: Visiting Brother Role
The bot MUST support a "Visiting Brother" role for verifying active members from other chapters.

#### Scenario: Visitor Verification
- **WHEN** a user is verified via the "Dual-Voucher" system but marked as "Other Chapter"
- **THEN** they receive the "Visiting Brother" role (Networking access) but NOT the "ΓΠ Brother" role (Voting access).

### Requirement: Geographic Profile
The bot MUST capture the user's Zip Code and automatically derive their location metadata.

#### Scenario: Zip Code Submission
- **WHEN** a user submits the "Brother Application" or "Guest Form" with Zip Code "10001"
- **THEN** the bot resolves this to "New York, NY (EST)" and stores it in the profile.