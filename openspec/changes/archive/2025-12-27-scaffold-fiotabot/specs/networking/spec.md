## ADDED Requirements
### Requirement: Professional Rolodex
The bot MUST capture professional details (Industry, Job Title) and support searching.

#### Scenario: Data Capture
- **WHEN** a Brother submits the verification form
- **THEN** they MUST provide "Industry" and "Job Title".

#### Scenario: Search
- **WHEN** a user runs `/find industry:Tech`
- **THEN** the bot returns a list of verified brothers in that industry.

### Requirement: Mentorship Program
The bot MUST allow brothers to self-identify as Mentors.

#### Scenario: Toggle Mentor Status
- **WHEN** a Brother runs `/mentor status:On`
- **THEN** they are assigned the "Open to Mentor" role and flagged in the database.
