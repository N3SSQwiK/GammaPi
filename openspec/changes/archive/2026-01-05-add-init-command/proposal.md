# Change: Add Consolidated Server Initialization Command

## Why

Server setup previously required multiple commands run in specific order:
1. `/setup` — Create Golden State infrastructure (roles, channels)
2. Navigate to #rules-and-conduct, run `/rules` — Post Code of Conduct
3. Navigate to #welcome-gate, run `/verify` — Post verification gate
4. `/bootstrap` — Register founding brothers

This created friction and potential for misconfiguration. The new `/init` command consolidates all initialization into a single command.

## What Changes

### Command Consolidation
- **DELETE** `/setup` — Merged into `/init`
- **DELETE** `/bootstrap` — Merged into `/init`
- **ADD** `/init` — Complete server initialization in one command

### `/init` Command Features
- Creates Golden State infrastructure (roles, channels with permissions)
- Posts Rules embed to #rules-and-conduct automatically
- Posts Verification Gate to #welcome-gate automatically
- Registers founding brothers via two-modal "Light the Torch" flow
- Supports registering other users as founding brothers (not just self)
- Chapter/industry selection via autocomplete (includes all chapters for owner)
- Auto-disables bootstrap portion once 2+ brothers exist

### New Behaviors
- Channel permission overwrites configured during setup (#welcome-gate, #verification-requests)
- Don Name is **required** for founding brothers (changed from optional)
- Collects full profile: First Name, Last Name, Don Name, Year/Semester, Job Title, Phone, City

## Impact

- **Affected specs**: `access-control`, `bot-core`
- **Affected code**:
  - `src/commands/init.ts` (new consolidated command)
  - `src/commands/setup.ts` (deleted)
  - `src/commands/bootstrap.ts` (deleted)
  - `src/modules/audit/setupHandler.ts` (unchanged, called by /init)
  - `src/modules/access/rulesHandler.ts` (createRulesEmbed exported for /init)
  - `src/modules/access/accessHandler.ts` (init modal handlers added)
  - `src/lib/verificationState.ts` (pendingInitRegistrations map added)
  - `src/modules/access/requirements.ts` (channel permission overwrites added)

### Breaking Changes
- **BREAKING**: `/setup` command no longer exists
- **BREAKING**: `/bootstrap` command no longer exists
- Users must use `/init` for server initialization
