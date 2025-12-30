# Bot Core Specification Deltas

## ADDED Requirements

### Requirement: Achievement Badge System
The system SHALL automatically detect brother achievements based on activity and award badges without manual intervention.

#### Scenario: Achievement unlock detection
- **WHEN** a brother performs an action matching achievement unlock criteria
- **THEN** the system checks if achievement already unlocked for that user
- **IF** not unlocked, insert record into `user_achievements` with current timestamp
- **AND** assign corresponding badge role to the user
- **AND** send DM notification: "🏆 Achievement Unlocked: [Name]! [Description]"

#### Scenario: Public achievement announcement
- **WHEN** an achievement is unlocked
- **THEN** the system posts to `#announcements` (if achievement is significant tier)
- **AND** uses format: "🎉 Congratulations @Brother on unlocking **[Achievement Name]**!"
- **AND** only announces high-tier achievements (not every single unlock)

#### Scenario: View personal achievements
- **WHEN** a brother executes `/achievements`
- **THEN** the system displays embed with two sections: "Unlocked" and "Locked"
- **AND** Unlocked section shows badge emoji, name, unlock date
- **AND** Locked section shows badge emoji, name, and unlock criteria
- **AND** shows progress bar for progressive achievements (e.g., "8/10 quiz questions correct")

#### Scenario: View another brother's achievements
- **WHEN** a brother executes `/achievements user:@OtherBrother`
- **THEN** the system displays that brother's unlocked achievements only
- **AND** hides locked achievements for privacy
- **AND** shows unlock dates for earned badges

### Requirement: Achievement Unlock Criteria
The system SHALL define clear, measurable criteria for each achievement badge.

#### Scenario: Networker badge
- **WHEN** a brother uses `/find` command for the first time
- **THEN** unlock "Networker" achievement
- **AND** assign Networker role

#### Scenario: Pillar of Attendance badge
- **WHEN** a brother's attendance count reaches 5 meetings
- **THEN** unlock "Pillar of Attendance" achievement
- **AND** assign Pillar of Attendance role

#### Scenario: Maestro badge
- **WHEN** a brother toggles `/mentor on` for the first time
- **THEN** unlock "Maestro" achievement
- **AND** assign Maestro role

#### Scenario: Historia Scholar badge
- **WHEN** a brother answers 10 Pop Quiz questions correctly (cumulative)
- **THEN** unlock "Historia Scholar" achievement
- **AND** assign Historia Scholar role

#### Scenario: Progressive achievement tracking
- **WHEN** an achievement has multi-level criteria (e.g., 10 quiz answers)
- **THEN** the system tracks progress in real-time
- **AND** shows progress indicator in `/achievements` view

### Requirement: Achievement Role Management
The system SHALL manage achievement badge roles as part of server Golden State.

#### Scenario: Achievement roles in serverConfig
- **WHEN** serverConfig.ts is loaded
- **THEN** EXPECTED_ROLES includes all achievement badge roles
- **AND** roles are prefixed with 🏆 emoji for visual distinction
- **AND** roles have no special permissions (cosmetic only)

#### Scenario: Setup creates achievement roles
- **WHEN** `/setup` command is executed
- **THEN** the system creates all achievement badge roles if they don't exist
- **AND** assigns role colors based on tier (bronze/silver/gold scheme)
- **AND** positions roles in hierarchy below core chapter roles

#### Scenario: Audit validates achievement roles
- **WHEN** `/audit` command is executed
- **THEN** the system verifies all achievement badge roles exist
- **AND** checks that no achievement role has dangerous permissions
- **AND** reports any missing or misconfigured achievement roles
