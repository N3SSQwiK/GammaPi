
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gamma Pi** is the digital chapter hub for the Gamma Pi Graduate/Professional Chapter of **Phi Iota Alpha Fraternity**. This repository contains:

1. **FiotaBot** (`fiota-bot/`) - Custom Discord bot for chapter management
2. **PillarFunFacts** (`PillarFunFacts/`) - n8n workflow for automated historical content
3. **OpenSpec** (`openspec/`) - Spec-driven development framework

## FiotaBot Development Commands

```bash
cd fiota-bot

# Build & Run
npm install                    # Install dependencies
npm run build                  # Compile TypeScript to dist/
npm start                      # Start bot locally
npm run deploy                 # Register slash commands with Discord (required after command changes)

# Testing
npm test                       # Run all tests
npm run test:watch             # Run tests in watch mode
npm run test:coverage          # Run tests with coverage report
npx jest src/lib/__tests__/validation.test.ts              # Run single test file
npx jest --testNamePattern="normalizeFirstName"            # Run tests matching pattern

# Data Export
npm run export                 # Export database to CSV files in exports/
```

## Architecture

### Technology Stack
- **Language**: TypeScript (strict mode, no `any` types)
- **Runtime**: Node.js (LTS)
- **Framework**: Discord.js v14
- **Database**: SQLite with better-sqlite3 (synchronous, single-writer)
- **Testing**: Jest with ts-jest
- **Logging**: Winston (JSON structured logs)
- **Process Manager**: PM2 (production)

### Key Architectural Patterns

**Modular Design by Domain**: Each capability has its own module under `src/modules/`:
- `access/` - Rules agreement & multi-step verification with dual-voucher system
- `audit/` - Server validation & Golden State infrastructure-as-code
- `operations/` - Attendance, voting, mentorship
- `networking/`, `pipeline/`, `community/` - Feature modules

**Golden State Pattern**: Infrastructure-as-code for Discord server structure
- Each module declares required roles/channels in `requirements.ts`
- `src/modules/audit/serverConfig.ts` aggregates all requirements
- `/init` creates missing infrastructure, `/audit` validates compliance

**Repository Pattern**: ALL database access goes through `src/lib/repositories/`
- `UserRepository` - User CRUD with member lifecycle (ACTIVE/SUSPENDED/REVOKED)
- `TicketRepository` - Verification tickets (PENDING → PENDING_2 → VERIFIED)
- `VoteRepository`, `AttendanceRepository`

**Multi-Modal Verification Flow**: Uses in-memory state objects in `src/lib/verificationState.ts`

### Critical Files
- `src/modules/audit/serverConfig.ts` - Golden State aggregation
- `src/modules/*/requirements.ts` - Module role/channel declarations
- `src/lib/constants.ts` - CHAPTERS (80+), INDUSTRIES (50+) with autocomplete helpers
- `src/lib/validation.ts` - Name matching, phone validation, voucher search
- `src/lib/displayNameBuilder.ts` - Display name formatting (don name priority)
- `src/deploy-commands.ts` - MUST run `npm run deploy` after command definition changes

### Test Location
Tests are in `src/lib/__tests__/`:
- `displayNameBuilder.test.ts` - Display name formatting (60+ cases)
- `validation.test.ts` - Name, phone, zip validation (28+ cases)

## Database Schema

SQLite database at `fiota-bot/fiota.db`:

**users**: Brother/guest profiles
- Identity: `first_name`, `last_name`, `don_name`, `real_name` (generated)
- Member lifecycle: `member_status` (ACTIVE/SUSPENDED/REVOKED), `suspended_at`, `revoked_at`, `suspension_reason`
- Chapter: `chapter`, `initiation_year`, `initiation_semester`
- Professional: `industry`, `job_title`, `zip_code`
- Status: `status` (GUEST/BROTHER), `rules_agreed_at`

**verification_tickets**: Dual-voucher verification flow
- Named vouchers: `named_voucher_1`, `named_voucher_2` (Discord IDs)
- Approvals: `voucher_1`, `voucher_2`, `voucher_1_at`, `voucher_2_at`
- Status: PENDING → PENDING_2 → VERIFIED/EXPIRED/OVERRIDDEN

## Slash Commands

**Server Setup**:
- `/init` - Server owner: creates roles/channels, posts embeds, registers founding brothers (disabled after 2 brothers exist)
- `/audit` - Validate server state against Golden State
- `/rules`, `/verify` - Re-post embeds (repair commands)

**Verification**:
- `/verify-start` - Begin verification (autocomplete for chapter/industry)
- `/verify-override` - E-Board: immediate verification
- `/chapter-assign` - E-Board: assign chapter (including hidden Omega)

**Member Management**:
- `/profile-update` - Update don name, phone, job title, city
- `/member-suspend`, `/member-unsuspend`, `/member-revoke` - E-Board: lifecycle management
- `/find` - Search brothers by industry, job title, location
- `/mentor` - Toggle mentorship availability

## OpenSpec Workflow

This project uses spec-driven development. Reference `openspec/AGENTS.md` for full details.

```bash
openspec list              # List active changes
openspec list --specs      # List specifications
openspec validate [item]   # Validate changes
openspec archive <id>      # Archive after deployment
```

**Key Spec Areas** in `openspec/specs/`:
- `access-control/` - Verification and permissions
- `audit/` - Server validation and Golden State
- `identity/` - User profiles and lifecycle
- `networking/` - Rolodex and search
- `operations/` - Attendance, voting, mentorship

## Deployment Checklist

1. `npm run build` - Clean TypeScript compilation
2. `npm test` - All tests pass
3. `npm run deploy` - Register commands (if definitions changed)
4. Test locally with `npm start`
5. Push to git, SSH to VPS, pull changes
6. Rebuild: `npm install && npm run build`
7. Restart: `pm2 restart fiota-bot`
8. Run `/audit` in Discord to validate

## Code Conventions

- **Repository Pattern**: ALL database access via `lib/repositories/`
- **Type Safety**: Strict TypeScript - no `any` types
- **Error Handling**: Use Winston logger, never silent failures
- **Spec-Driven**: Non-trivial changes require OpenSpec proposal

## PillarFunFacts

n8n workflows for automated "Pillar Fun Facts" posts:
- `n8n_workflow_v2.json` - Enhanced with Gemini AI
- `seed_topics.json` - Topic seed list (Pillars, History, Concepts)
- Discord embed color: `#B41528` (fraternity red)
