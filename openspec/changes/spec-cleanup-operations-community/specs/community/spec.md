## ADDED Requirements

### Requirement: Lions Den Personal Blog Forum
The system SHALL provide a forum channel for brothers to share personal updates and life content.

#### Scenario: Lions Den channel configuration
- **WHEN** `/init` creates server channels
- **THEN** system creates `#lions-den` as GuildForum type
- **AND** configures requireTag: true
- **AND** sets default reaction to lion emoji
- **AND** creates tags: My Life, Fitness, Projects, Gaming, Food, Philanthropy, Education, Training

#### Scenario: Lions Den usage guidelines
- **WHEN** user views forum guidelines
- **THEN** guidelines explain: "Create ONE thread to serve as your personal blog/feed. Share updates on your life, projects, or fitness journey. Follow other brothers to stay connected."

### Requirement: Tech Support Forum
The system SHALL provide a forum channel for bug reports and feature requests.

#### Scenario: Tech Support channel configuration
- **WHEN** `/init` creates server channels
- **THEN** system creates `#tech-support` as GuildForum type
- **AND** configures requireTag: true
- **AND** sets default reaction to bug emoji
- **AND** creates tags: Bug, Feature

#### Scenario: Tech Support usage guidelines
- **WHEN** user views forum guidelines
- **THEN** guidelines explain: "Report bugs or suggest features for FiotaBot."

### Requirement: Community Module Registration
The system SHALL register community channels in the Golden State configuration.

#### Scenario: Community requirements registered
- **WHEN** bot initializes
- **THEN** community module registers its channel requirements via `registerRequirements('community', ...)`
- **AND** channels are included in `/init` and `/audit` Golden State checks
