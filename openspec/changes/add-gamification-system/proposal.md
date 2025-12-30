# Change: Gamification & Recognition System

## Why

Professional chapters struggle with silent participation - brothers join Discord but lurk without engaging. Traditional "shoutouts" lack structure and fail to reinforce desired behaviors. We need lightweight gamification that celebrates authentic participation (networking, mentoring, content creation) without creating busywork. Achievement badges provide intrinsic motivation while structured "Wins Channel" builds chapter pride.

## What Changes

- **Achievement Badge System**: Automated recognition for key behaviors (first `/find` usage, 5 meetings attended, mentoring, content posts). Event-driven, no manual administration.
- **Wins Channel Transformation**: Convert generic shoutouts to structured celebration pipeline with auto-formatted embeds for promotions, degrees, certifications.
- **Quarterly Wins Roundup**: Automated compilation of chapter achievements for external sharing (LinkedIn, newsletters).

All features use positive reinforcement psychology - celebrating progress over competition, intrinsic over extrinsic rewards.

## Impact

- **Affected specs**:
  - `bot-core` - Add achievement tracking system, badge assignment logic
  - `operations` - Add wins formatting, quarterly roundup generation
- **Affected code**:
  - `fiota-bot/src/lib/repositories/` - Add AchievementRepository
  - `fiota-bot/src/modules/operations/` - Add winsHandler.ts
  - `fiota-bot/src/commands/` - Add `/wins` and `/achievements` commands
  - `serverConfig.ts` - Add achievement badge roles to EXPECTED_ROLES
- **New features**:
  - 10+ achievement badges with unlock criteria
  - Wins posting template system
  - Quarterly achievement compilation workflow
- **Migration**: Create achievement badge roles via `/setup` command
