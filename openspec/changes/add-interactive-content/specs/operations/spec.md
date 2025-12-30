# Operations Specification Deltas

## ADDED Requirements

### Requirement: Engagement Analytics Dashboard
The system SHALL provide E-Board with monthly engagement analytics for strategic planning.

#### Scenario: Monthly engagement report
- **WHEN** the first Monday of each month at 10am arrives
- **THEN** the system generates engagement report for previous month
- **AND** includes metrics: quiz participation rate, spotlight completion rate, industry pulse responses
- **AND** posts summary to `#officer-chat` with trend analysis (up/down vs prior month)

#### Scenario: Export engagement data
- **WHEN** an E-Board member executes `/engagement-export month:YYYY-MM`
- **THEN** the system generates CSV with all engagement events for specified month
- **AND** includes columns: user_id, name, event_type, timestamp, details
- **AND** uploads file to channel for download

### Requirement: Content Quality Feedback
The system SHALL collect brother feedback on interactive content to improve future iterations.

#### Scenario: Quiz feedback reaction
- **WHEN** a Pop Quiz reveal message is posted (showing correct answer)
- **THEN** the system adds three reaction options: 👍 (too easy), 🎯 (just right), 🧠 (challenging)
- **AND** tracks reaction counts for quiz difficulty calibration

#### Scenario: Spotlight engagement tracking
- **WHEN** a Brother Spotlight post is published
- **THEN** the system tracks reply count and reaction count after 48 hours
- **AND** records engagement score in `spotlight_schedule` table
- **AND** uses score to identify high-engagement topics for future prompts

#### Scenario: Industry Pulse effectiveness
- **WHEN** an Industry Pulse discussion is 7 days old
- **THEN** the system calculates engagement score (replies + reactions)
- **AND** records topic effectiveness for future topic selection
- **AND** deprioritizes low-engagement topics in next cycle
