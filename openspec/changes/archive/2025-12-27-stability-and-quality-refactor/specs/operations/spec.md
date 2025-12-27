## MODIFIED Requirements
### Requirement: Simple Voting
The bot MUST allow officers to create secure polls using interactive components.

#### Scenario: Create Poll
- **WHEN** an Officer runs `/vote topic:"Pizza vs Tacos"`
- **THEN** a poll Embed is created with Button options (Yes, No, Abstain), ensuring each user can only vote once.
