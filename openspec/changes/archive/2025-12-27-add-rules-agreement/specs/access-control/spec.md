## MODIFIED Requirements
### Requirement: Two-Step Access Control
The system MUST distinguish between "Identity Verification" and "Server Access".

#### Scenario: Verification Success
- **WHEN** a user passes the Dual-Voucher or LinkedIn check
- **THEN** they receive their Identity Role (e.g., `ΓΠ Brother`) BUT CANNOT yet view general channels. They MUST be directed to `#rules-and-conduct`.

## ADDED Requirements
### Requirement: Explicit Rules Agreement
Users MUST explicitly click a button to accept the Code of Conduct before gaining write access to the community.

#### Scenario: Rules Acceptance
- **WHEN** a Verified User clicks `[✅ I Agree]` in `#rules-and-conduct`
- **THEN** the system grants the `Rules Accepted` role, logs the timestamp, and unlocks the server.
