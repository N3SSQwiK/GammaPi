# Operations Specification Deltas

## ADDED Requirements

### Requirement: Structured Wins Posting
The system SHALL provide a standardized workflow for brothers to share professional achievements.

#### Scenario: Submit a win via command
- **WHEN** a brother executes `/wins`
- **THEN** the system presents interactive form with fields:
  - Win Type (dropdown): Promotion, Degree, Certification, Award, Milestone, Other
  - Title (text): e.g., "Senior Software Engineer at Google"
  - Organization (text): Company or school name
  - Description (optional, 200 chars): Additional context
- **AND** form validates required fields before submission

#### Scenario: Win embed formatting
- **WHEN** a brother submits a win via form
- **THEN** the system generates formatted embed with:
  - Color matching win type (gold for promotion, blue for degree, etc.)
  - Emoji matching win type (🎉 promotion, 🎓 degree, 📜 certification, 🏆 award)
  - Title as embed title
  - Description as embed description
  - Brother's name and profile picture in footer
  - Timestamp of posting
- **AND** posts embed to designated wins channel

#### Scenario: Win celebration automation
- **WHEN** a win is posted
- **THEN** the system adds 🎉 reaction automatically
- **AND** mentions relevant role based on win type (@Everyone for major wins, industry role for career wins)
- **AND** records win in `wins` table with user_id, win_type, title, description

#### Scenario: Track win engagement
- **WHEN** a win post receives reactions or replies
- **THEN** the system periodically updates reaction_count in `wins` table
- **AND** uses engagement score to identify high-impact win types
- **AND** surfaces most-celebrated wins in quarterly roundup

### Requirement: Quarterly Wins Roundup
The system SHALL automatically compile and share chapter achievements each quarter.

#### Scenario: Quarterly compilation trigger
- **WHEN** the first Monday of January, April, July, or October arrives at 10am
- **THEN** the system queries all wins from previous 3 months
- **AND** groups wins by type (promotions, degrees, certifications, etc.)
- **AND** calculates statistics (total wins, most common type, most reactions)

#### Scenario: Roundup message formatting
- **WHEN** quarterly wins are compiled
- **THEN** the system generates formatted message:
  - Header: "🦁 Gamma Pi Q[X] YYYY Achievements Roundup"
  - Statistics section: "This quarter our brotherhood celebrated: X promotions, Y degrees, Z certifications"
  - Highlight section: "Top 3 most-celebrated wins" with names and titles
  - Call to action: "Share your next win with /wins!"
- **AND** posts to `#announcements` channel

#### Scenario: Roundup export for external sharing
- **WHEN** quarterly roundup is generated
- **THEN** the system creates text-only version optimized for LinkedIn post
- **AND** generates CSV export with all wins for chapter records
- **AND** uploads both files to `#officer-chat` for E-Board use
- **AND** suggests LinkedIn posting: "Consider sharing this on Gamma Pi LinkedIn!"

### Requirement: Gamification Analytics
The system SHALL track gamification effectiveness for continuous improvement.

#### Scenario: Achievement unlock rate tracking
- **WHEN** E-Board executes `/engagement-export`
- **THEN** the system includes achievement unlock rates by badge type
- **AND** shows which badges are most/least frequently earned
- **AND** identifies brothers with 0 achievements (engagement risk indicator)

#### Scenario: Wins posting trends
- **WHEN** monthly engagement report is generated
- **THEN** the system includes wins posting statistics
- **AND** shows wins count by type (promotions vs degrees vs certifications)
- **AND** compares to prior month trend (up/down indicator)
- **AND** highlights brothers who posted wins (recognition)
