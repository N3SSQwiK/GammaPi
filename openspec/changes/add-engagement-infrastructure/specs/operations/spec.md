# Operations Specification Deltas

## ADDED Requirements

### Requirement: Digest Performance Analytics
The system SHALL track digest engagement metrics to optimize content and timing.

#### Scenario: Weekly digest report
- **WHEN** Monday 9am arrives (3 days after Friday digest)
- **THEN** the system calculates previous week's digest metrics:
  - Total sent count
  - Open rate (opened / sent)
  - Click-through rate (clicked / opened)
  - Top-clicked content type (discussions vs jobs vs wins)
- **AND** posts summary to `#officer-chat` for E-Board review

#### Scenario: Content type performance tracking
- **WHEN** digest analytics are compiled
- **THEN** the system tracks clicks per content section:
  - Discussions section CTR
  - Events section CTR
  - Jobs section CTR
  - Wins section CTR
- **AND** identifies highest-engagement content types
- **AND** recommends prioritization: "Jobs section had 45% CTR - consider featuring more prominently"

#### Scenario: Subscriber growth tracking
- **WHEN** monthly engagement report is generated
- **THEN** the system includes digest subscription metrics:
  - Total subscribers
  - New subscribers this month
  - Unsubscribes this month
  - Net growth rate
  - Subscription rate (subscribers / total brothers)

### Requirement: Knowledge Vault Contribution Tracking
The system SHALL monitor vault activity to ensure ongoing value creation.

#### Scenario: Monthly vault metrics
- **WHEN** monthly engagement report is generated
- **THEN** the system includes knowledge vault statistics:
  - Total entries posted this month
  - Unique contributors (brothers who posted)
  - Average upvotes per entry
  - Most popular category (by post count)
  - Top contributor (by total upvotes received)

#### Scenario: Vault engagement alerts
- **WHEN** no vault entries posted in 14 consecutive days
- **THEN** the system sends alert to `#officer-chat`:
  - "📚 Knowledge Vault Alert: No new entries in 2 weeks"
  - Suggests promotion: "Consider highlighting vault in next announcement"

#### Scenario: Quality threshold reporting
- **WHEN** monthly vault compilation runs
- **THEN** the system reports on quality distribution:
  - Percentage of entries with 5+ upvotes
  - Percentage with 10+ upvotes
  - Percentage with 25+ upvotes (Sage threshold)
- **AND** uses metrics to calibrate quality standards

### Requirement: Cross-Feature Engagement Attribution
The system SHALL track how infrastructure features drive overall chapter engagement.

#### Scenario: Digest-driven re-engagement
- **WHEN** a brother clicks link in digest and visits Discord
- **THEN** UTM parameters identify source as "pulse-email"
- **AND** system tracks subsequent activity (posts, reactions, command usage) within 24 hours
- **AND** attributes activity to digest in engagement analytics

#### Scenario: Vault-driven discussion spawning
- **WHEN** a vault entry generates 5+ reply comments
- **THEN** the system tracks thread as "high-discussion vault post"
- **AND** suggests moving discussion to appropriate channel for broader participation
- **AND** awards "Conversation Starter" progress to author

#### Scenario: Infrastructure ROI measurement
- **WHEN** quarterly engagement report is generated
- **THEN** the system includes infrastructure metrics:
  - Brothers re-engaged via digest (clicked + posted within 24h)
  - Knowledge vault search usage count
  - Vault entries referenced in other discussions (manual tracking suggested)
- **AND** calculates engagement lift: "30% of inactive brothers re-engaged after digest click"
