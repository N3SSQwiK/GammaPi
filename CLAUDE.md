<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gamma Pi** is the digital chapter hub for the Gamma Pi Graduate/Professional Chapter of **Phi Iota Alpha Fraternity**. This repository contains two main software components plus comprehensive strategic documentation for migrating chapter operations to Discord.

### Main Components

1. **FiotaBot** (`fiota-bot/`) - Custom Discord bot for chapter management
2. **PillarFunFacts** (`PillarFunFacts/`) - Automated historical content workflows
3. **Strategic Documentation** - Migration guides, SOPs, and runbooks

## FiotaBot Architecture

### Technology Stack
- **Language**: TypeScript (strict mode)
- **Runtime**: Node.js (LTS)
- **Framework**: Discord.js v14
- **Database**: SQLite with better-sqlite3
- **Logging**: Winston
- **Scheduling**: node-cron
- **Process Manager**: PM2 (production)

### Project Structure
```
fiota-bot/
├── src/
│   ├── index.ts                 # Bot entry point
│   ├── deploy-commands.ts       # Slash command registration
│   ├── commands/                # Discord slash commands
│   │   ├── rules.ts            # Post Code of Conduct embed
│   │   ├── verify.ts           # Post verification gate
│   │   └── ...                 # Other commands
│   ├── modules/                 # Business logic modules
│   │   ├── access/             # Rules agreement & verification
│   │   │   ├── accessHandler.ts    # Verification flow
│   │   │   └── rulesHandler.ts     # Code of Conduct agreement
│   │   ├── audit/              # Server audit & Golden State
│   │   └── operations/         # Attendance, voting, etc.
│   └── lib/
│       ├── db.ts               # Database connection
│       ├── logger.ts           # Winston logging
│       ├── scheduler.ts        # Cron jobs
│       └── repositories/       # Data access layer
├── package.json
└── tsconfig.json
```

### Key Features
- **Rules Agreement**: Code of Conduct acceptance required before verification (`/rules` posts embed, `✅ Rules Accepted` role gates access)
- **Dual-Voucher Verification**: Two-step member onboarding requiring approval from 2 active brothers
- **Professional Rolodex**: Searchable database by industry, job title, location (`/find`)
- **Pipeline Tracking**: Candidate and Interest status management (`/pipeline`)
- **Server Audit**: Weekly automated validation of roles, channels, permissions (`/audit`)
- **Golden State Enforcement**: Infrastructure-as-code via `serverConfig.ts` with `/setup` command
- **Geographic Intelligence**: Auto-derive city/state/timezone from zip codes

### Development Commands
```bash
cd fiota-bot
npm install           # Install dependencies
npm run build         # Compile TypeScript to dist/
npm run deploy        # Register slash commands (required on first run and after command changes)
npm start             # Start bot (production: pm2 start dist/index.js)
```

### Critical Files
- `src/modules/audit/serverConfig.ts` - The "Golden State" configuration defining all required roles (including `✅ Rules Accepted`), channels (including `#rules-and-conduct`), forum tags, and reactions
- `src/modules/access/rulesHandler.ts` - Code of Conduct embed and agreement logic
- `src/modules/access/accessHandler.ts` - Brother/Guest verification flow with dual-voucher system
- `src/lib/repositories/` - All database access MUST go through repository pattern (UserRepository, VoteRepository, AttendanceRepository, TicketRepository)
- `src/deploy-commands.ts` - MUST run `npm run deploy` after any changes to slash command definitions

### Environment Variables
Required in `.env`:
```
DISCORD_TOKEN=          # Bot token from Discord Developer Portal
CLIENT_ID=              # Application ID
GUILD_ID=               # Discord server ID
VERIFICATION_CHANNEL_ID=  # Channel for verification requests
AUDIT_CHANNEL_ID=         # Channel for audit reports
```

### Database Schema
SQLite database located at `data/fiota.db`:
- `users` - Brother profiles with industry, location, verification status, `rules_agreed_at` timestamp
- `verification_tickets` - Pending verification requests with dual-voucher tracking
- `votes` - Voting records with issue tracking
- `attendance` - Meeting attendance logs

### Code Conventions
- **Modular Design**: Separate commands (interface), modules (logic), and lib (infrastructure)
- **Repository Pattern**: ALL database access goes through repositories in `lib/repositories/`
- **Type Safety**: Strict TypeScript mode enabled - no `any` types
- **Error Handling**: Use Winston logger, never silent failures
- **Spec-Driven**: All changes require OpenSpec proposal and validation

## PillarFunFacts Architecture

### Workflow Versions
Two n8n workflow versions exist in `PillarFunFacts/`:

- **n8n_workflow.json** (v1): Simple version using Wikipedia Summary API directly
- **n8n_workflow_v2.json** (v2): Enhanced version with Gemini AI integration

### Workflow Pipeline (v2)
```
Daily Schedule (9am) → Pick Random Topic → Fetch Wikipedia HTML → Extract Text & Image → Gemini AI → Discord Webhook
```

### Topic Categories (seed_topics.json)
- `Pillar`: The five pillars (Bolívar, San Martín, O'Higgins, Martí, Juárez)
- `History`: Phi Iota Alpha organizational history
- `Concept`: Pan-Americanism and related ideologies
- `General`: Latin American independence events

### n8n Configuration
- Workflows stored as JSON exports from n8n
- Credential placeholders use `YOUR_*` pattern (e.g., `YOUR_DISCORD_WEBHOOK_URL_HERE`, `YOUR_GEMINI_CREDENTIAL_ID`)
- Wikipedia API requests require User-Agent: `GammaPiBot/1.0`
- Discord embed color: `#B41528` (fraternity red)

## OpenSpec Workflow

This project uses spec-driven development:
1. All changes start with `/openspec:proposal` to create a proposal in `openspec/changes/`
2. Specs are validated against requirements in `openspec/specs/`
3. Changes are applied with `/openspec:apply`
4. Deployed changes are archived with `/openspec:archive`

**Key Spec Areas**:
- `access-control/` - Verification and permission systems
- `audit/` - Server validation and Golden State
- `bot-core/` - Core Discord bot infrastructure
- `identity/` - User profiles and geographic data
- `networking/` - Rolodex and search functionality
- `operations/` - Attendance, voting, mentorship

## Critical Documentation Files

- **GEMINI.md** - Comprehensive overview (build instructions, architecture)
- **FiotaBot_Implementation_SOP.md** - Step-by-step deployment guide
- **GammaPi_Discord_Migration_Report.md** - Strategic migration plan
- **FiotaBot_Spec.md** - Technical specification and schema
- **GammaPi_Tech_Chair_Runbook.md** - Operational runbook for tech chairs

## Security & Credentials

- **NEVER commit** `.env` files or Discord tokens
- **Credential Placeholders**: Use `YOUR_*` pattern in templates and documentation
- **Permission Model**: Least-privilege principle - audit all role permissions
- **Two-Factor Onboarding**: Dual-voucher system prevents unauthorized access

## Deployment Checklist

Before deploying FiotaBot changes:
1. ✅ Run `npm run build` - ensure clean TypeScript compilation
2. ✅ Run `npm run deploy` - register updated slash commands (if command definitions changed)
3. ✅ Test locally with `npm start`
4. ✅ Verify environment variables in production `.env`
5. ✅ Push to git, SSH to VPS, pull changes
6. ✅ Rebuild on server: `npm install && npm run build`
7. ✅ Restart PM2: `pm2 restart fiota-bot`
8. ✅ Run `/audit` in Discord to validate server state

## Common Tasks

**Add a new slash command:**
1. Create command file in `src/commands/`
2. Import and add to `index.ts` commands array
3. Run `npm run deploy` to register with Discord
4. Restart bot

**Modify server structure:**
1. Update `src/modules/audit/serverConfig.ts`
2. Test with `/setup` in a test server
3. Validate with `/audit`

**Add database fields:**
1. Update repository in `src/lib/repositories/`
2. Update TypeScript interfaces
3. Handle migration (SQLite ALTER TABLE or recreate)

**Update OpenSpec:**
1. Use `/openspec:proposal` for new features
2. Follow spec format in `openspec/specs/`
3. Apply with `/openspec:apply` after validation
