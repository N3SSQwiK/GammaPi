# Bot Core Specification Deltas

## ADDED Requirements

### Requirement: Quiz Leaderboard Tracking
The system SHALL track brother participation in Pop Quiz activities and maintain monthly leaderboards.

#### Scenario: Brother responds to quiz
- **WHEN** a brother selects an answer in a Discord poll quiz
- **THEN** the system records their response, correctness, and timestamp in `quiz_responses` table
- **AND** updates their monthly score in `engagement_metrics`

#### Scenario: Monthly leaderboard query
- **WHEN** a brother executes `/quiz-stats`
- **THEN** the system displays top 10 brothers by correct answers for current month
- **AND** shows the user's personal rank and score

#### Scenario: Champion announcement
- **WHEN** the last day of the month arrives at 5pm
- **THEN** the system automatically posts "Historia Champion" announcement
- **AND** tags the top 3 brothers with their scores
- **AND** resets monthly counters for new period

### Requirement: Brother Spotlight Rotation
The system SHALL manage automated weekly spotlights of brother professional journeys with fair rotation.

#### Scenario: Spotlight scheduling
- **WHEN** Monday 9am arrives and no spotlight scheduled for current week
- **THEN** the system selects a random brother who hasn't been spotlighted in past 6 months
- **AND** DMs the selected brother with submission form link
- **AND** records scheduled_date in `spotlight_schedule` table

#### Scenario: Brother submits spotlight content
- **WHEN** a brother submits 3-sentence bio + current project via Discord form
- **THEN** the system validates submission (max 500 chars total)
- **AND** updates `spotlight_schedule` with content and marks submission_status as 'complete'
- **AND** confirms submission with DM: "Your spotlight will post Friday at 5pm!"

#### Scenario: Spotlight publication
- **WHEN** Friday 5pm arrives and spotlight submission is complete
- **THEN** the system posts formatted embed to `lions-den` forum
- **AND** includes brother's name, industry, location, bio, and current project
- **AND** adds LinkedIn profile link if available in user profile

#### Scenario: Spotlight non-submission
- **WHEN** Friday 3pm arrives and spotlight submission is incomplete
- **THEN** the system sends reminder DM to selected brother
- **IF** no submission by Friday 4:30pm, reschedule for next available brother
- **AND** log skip event for future rotation fairness

### Requirement: Industry Pulse Discussion Automation
The system SHALL generate weekly discussion starters tied to trending topics in brothers' professional industries.

#### Scenario: Industry topic generation
- **WHEN** Sunday 8pm arrives
- **THEN** the system fetches trending LinkedIn hashtags OR uses manual seed list
- **AND** matches hashtags to brother industries in database
- **AND** selects top 3 topics with most brother coverage

#### Scenario: Industry pulse posting
- **WHEN** Monday 9am arrives
- **THEN** the system posts conversation starter for each topic
- **AND** auto-tags brothers in matching industries (max 10 tags per post)
- **AND** includes context: "X brothers in our chapter work in this space"
- **AND** posts to appropriate channel (e.g., `career-center` or industry-specific)

#### Scenario: Brother interaction tracking
- **WHEN** a tagged brother responds to Industry Pulse post
- **THEN** the system records participation in `engagement_metrics`
- **AND** increments their "Industry Expert" counter

### Requirement: Engagement Metrics Repository
The system SHALL provide a centralized repository for tracking all engagement activities.

#### Scenario: Record engagement event
- **WHEN** EngagementRepository.recordEvent(userId, metricType, value, period) is called
- **THEN** the system inserts or updates record in `engagement_metrics` table
- **AND** metricType is one of: 'quiz_score', 'spotlight_posted', 'industry_response', 'achievement_earned'
- **AND** period is formatted as 'YYYY-MM' for monthly aggregation

#### Scenario: Query monthly leaderboard
- **WHEN** EngagementRepository.getLeaderboard(metricType, period, limit) is called
- **THEN** the system returns sorted list of brothers with highest values
- **AND** includes user_id, name, value, rank
- **AND** limits results to specified number (default 10)

#### Scenario: Get user engagement summary
- **WHEN** EngagementRepository.getUserSummary(userId, period) is called
- **THEN** the system returns all engagement metrics for the user in specified period
- **AND** includes quiz scores, spotlight status, industry responses, achievements
