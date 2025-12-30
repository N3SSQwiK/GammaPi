# Change: Interactive Content Features for Brotherhood Engagement

## Why

Graduate/professional chapters face unique engagement challenges: busy schedules, geographic dispersion, and passive content consumption. Current PillarFunFacts provides valuable educational content but lacks interactive elements to drive discussion and build community knowledge. We need features that transform passive readers into active participants while respecting their limited time.

## What Changes

- **Pop Quiz System**: Extends PillarFunFacts workflow to post multiple-choice trivia 1 hour after daily facts, using Discord's native polls. Tracks monthly "Historia Champions" via leaderboard.
- **Brother Spotlight Series**: Automated weekly rotation highlighting brothers' professional journeys, surfacing hidden expertise and humanizing the rolodex.
- **Industry Pulse Discussions**: Weekly automated conversation starters tied to trending topics in brothers' industries, auto-tagging relevant members using `/find` data.

All features prioritize minimal overhead through automation (n8n workflows) and self-service contribution models.

## Impact

- **Affected specs**:
  - `bot-core` - Add quiz leaderboard tracking, spotlight rotation, industry trending integration
  - `operations` - Add engagement metrics tracking
- **Affected code**:
  - `PillarFunFacts/n8n_workflow_v2.json` - Extend with quiz posting logic
  - New n8n workflows for Brother Spotlight and Industry Pulse
  - `fiota-bot/src/lib/repositories/` - Add EngagementRepository for leaderboards
  - `fiota-bot/src/commands/` - Add `/spotlight` and `/quiz-stats` commands
- **External dependencies**:
  - LinkedIn API (optional, for Industry Pulse trending topics)
  - Discord Polls API (native, no additional setup)
- **Migration**: None - all new features, no breaking changes
