# Change: Networking Automation (Office Hours Roulette & Geographic Clusters)

## Why

The Professional Rolodex provides search capability but doesn't facilitate actual connections. Brothers know each other exists but lack structured opportunities for meaningful 1:1 conversations. Geographic data is collected but underutilized for in-person meetups. We need automation that creates connection opportunities: randomized coffee chats for cross-industry pollination and location-based clustering for local bonding.

## What Changes

- **Office Hours Roulette**: Monthly automated pairing system that DMs brothers with complementary backgrounds (or random pairs) for 15-minute virtual coffee chats. Tracks completion to measure connection quality.
- **Geographic Clusters**: Leverages existing zip code data to auto-suggest local meetups. Creates region-specific channels (e.g., `#northeast-meetups`) and notifies brothers when 3+ are in proximity.
- **Connection Incentives**: Integrates with achievement system - "Connector" badge for completing 5 coffee chats, "Local Legend" for attending 3 geographic meetups.

All features respect busy schedules (opt-in model) and automate matchmaking to reduce coordination friction.

## Impact

- **Affected specs**:
  - `networking` - Add Office Hours pairing algorithm, geographic clustering logic
  - `identity` - Enhance location data usage for proximity calculations
- **Affected code**:
  - `fiota-bot/src/lib/repositories/` - Add ConnectionsRepository for tracking pairings
  - `fiota-bot/src/modules/networking/` - Add officeHoursHandler.ts, geoClusterHandler.ts
  - `fiota-bot/src/commands/` - Add `/coffee`, `/meetup`, `/opt-in-roulette`
  - New n8n workflow for monthly pairing automation
- **New features**:
  - Monthly pairing system with smart matching
  - Geographic proximity notifications
  - Regional meetup channels
  - Connection completion tracking
- **Migration**: None - all new opt-in features
