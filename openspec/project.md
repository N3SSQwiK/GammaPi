# Project Context

## Purpose

**Gamma Pi** is the digital chapter hub for the **Gamma Pi Graduate/Professional Chapter** of **Phi Iota Alpha Fraternity** - the oldest Latino fraternity in existence (founded 1931). This repository contains:

1. **FiotaBot** - Custom Discord bot for chapter management (identity, operations, networking)
2. **PillarFunFacts** - Automated historical content workflows via n8n
3. **Strategic Documentation** - Migration guides, SOPs, and operational runbooks

The primary goal is to migrate chapter operations from WhatsApp to Discord, enabling professional engagement, streamlined internal business, and automated workflows for a geographically dispersed graduate chapter.

## Tech Stack

### FiotaBot (Discord Bot)
- **Language:** TypeScript (strict mode)
- **Runtime:** Node.js (LTS)
- **Framework:** Discord.js v14
- **Database:** SQLite with better-sqlite3
- **Logging:** Winston (structured JSON logs)
- **Scheduling:** node-cron
- **Process Manager:** PM2 (production)

### PillarFunFacts (Automation)
- **Platform:** n8n (self-hosted)
- **AI Integration:** Google Gemini
- **Data Source:** Wikipedia API + internal seed topics

### Infrastructure
- **Hosting:** Hostinger VPS (Ubuntu/Debian)
- **Version Control:** Git/GitHub
- **Spec Management:** OpenSpec

## Project Conventions

### Code Style
- **TypeScript Strict Mode:** No `any` types, explicit return types
- **Naming:** camelCase for functions/variables, PascalCase for interfaces/types
- **File Naming:** kebab-case for files (e.g., `user-repository.ts`)
- **Constants:** SCREAMING_SNAKE_CASE for true constants, exported from `constants.ts`

### Architecture Patterns
- **Modular Design:** Separate concerns into `commands/`, `modules/`, `lib/`
- **Repository Pattern:** ALL database access goes through repositories in `lib/repositories/`
- **Handler Pattern:** Event/interaction handlers in `modules/` organized by domain
- **Golden State:** Server infrastructure (roles, channels, tags) defined in `serverConfig.ts`

### Directory Structure
```
fiota-bot/
├── src/
│   ├── index.ts                 # Bot entry point
│   ├── deploy-commands.ts       # Slash command registration
│   ├── commands/                # Discord slash commands (interface layer)
│   ├── modules/                 # Business logic by domain
│   │   ├── access/             # Verification & onboarding
│   │   ├── audit/              # Server audit & Golden State
│   │   ├── identity/           # User profiles & geographic data
│   │   ├── networking/         # Rolodex & professional search
│   │   └── operations/         # Attendance, voting, mentorship
│   └── lib/
│       ├── db.ts               # Database connection & schema
│       ├── logger.ts           # Winston configuration
│       ├── scheduler.ts        # Cron job setup
│       ├── constants.ts        # Chapters, industries, config
│       └── repositories/       # Data access layer
├── package.json
└── tsconfig.json
```

### Testing Strategy
- **Manual Testing:** Test in development Discord server before production
- **Validation:** Run `/audit` after deployments to verify server state
- **Logging:** Check `logs/combined.log` and `logs/error.log` for issues

### Git Workflow
- **Branch Naming:** `feature/description`, `fix/description`, `claude/description`
- **Commit Format:** `type: description` (e.g., `feat:`, `fix:`, `docs:`, `spec:`)
- **PR Requirements:** OpenSpec proposal for significant features
- **Main Branch:** Protected, requires review

## Domain Context

### Fraternity Terminology
- **Brother:** Initiated member of Phi Iota Alpha
- **Don Name:** Fraternity nickname assigned at initiation (e.g., "Don Phoenix")
- **Chapter:** Local organization (e.g., Alpha, Beta, Gamma Pi)
- **Omega Chapter:** Reserved designation for deceased brothers (hidden from public)
- **Line:** Group of brothers who crossed (initiated) together
- **Crossing:** The initiation ceremony
- **Voucher:** Brother who confirms identity of new member during verification

### Chapter Types
- **Undergraduate:** Campus-based chapters (Alpha, Beta, etc.)
- **Graduate/Professional:** Gamma Pi - for alumni and working professionals (National scope)
- **Satellite:** Emerging groups working toward full chapter status

### Verification System
- **Dual-Voucher:** Two existing brothers must approve new member verification
- **Voucher Requirement:** Both vouchers must have `status='BROTHER'` in database

### Key Roles
- **E-Board:** Executive board members (Officers) with administrative privileges
- **Line Committee:** Officers responsible for intake process
- **Tech Chair:** Administrator responsible for bot maintenance and infrastructure

## Important Constraints

### Technical Constraints
- **Discord Modal Limitations:** Modals only support text inputs (no dropdowns, no radio buttons)
  - Solution: Multi-step flows using Select Menus before Modal
- **SQLite Single-Writer:** Better-sqlite3 is synchronous; use transactions for complex operations
- **Discord Rate Limits:** Respect API rate limits, especially for bulk operations

### Business Constraints
- **Privacy:** Phone numbers and personal data are PII - Brothers Only visibility
- **Compliance:** Follow National Phi Iota Alpha policies for intake/membership
- **Chapter Advisor:** Must have full admin access for oversight

### Data Constraints
- **Chapter List:** Sourced from phiota.org/chapters, manually updated quarterly
- **Industry List:** Based on NAICS taxonomy, E-Board can request additions
- **Omega Chapter:** Never exposed in public verification; E-Board assignment only

## External Dependencies

### Discord Services
- **Discord API:** Bot token, Gateway Intents (Guild Members, Message Content, Presence)
- **Discord Developer Portal:** Application management, OAuth2

### Google Services
- **Gemini API:** AI content generation for PillarFunFacts
- **Google Cloud Console:** API quota management

### LinkedIn (Planned)
- **LinkedIn Developer API:** OAuth verification for guests (pending implementation)
- **Sign In with LinkedIn:** Profile verification for spam prevention

### Infrastructure Services
- **Hostinger VPS:** Compute, storage, SSH access
- **PM2:** Process management, auto-restart
- **n8n:** Workflow automation (self-hosted)

## Active Proposals

See `openspec/changes/` for pending feature proposals:

| Proposal | Description | Status |
|----------|-------------|--------|
| `enhance-verification-ux` | Multi-step verification, don names, chapter/industry dropdowns | Pending |
| `add-interactive-content` | Pop Quiz, Brother Spotlight, Industry Pulse | Pending |
| `add-gamification-system` | Achievement badges, structured Wins channel | Pending |
| `add-networking-automation` | Office Hours Roulette, geographic clusters | Pending |
| `add-engagement-infrastructure` | Weekly Pulse digest, Knowledge Vault | Pending |
| `add-linkedin-bridge` | LinkedIn profile sync, amplification | Pending |

## Quick Reference

### Development Commands
```bash
cd fiota-bot
npm install           # Install dependencies
npm run build         # Compile TypeScript
npm run deploy        # Register slash commands with Discord
npm start             # Start bot locally
pm2 start dist/index.js --name FiotaBot  # Production start
```

### Key Environment Variables
```env
DISCORD_TOKEN=        # Bot token from Developer Portal
CLIENT_ID=            # Application ID
GUILD_ID=             # Discord server ID
VERIFICATION_CHANNEL_ID=  # Where verification tickets go
AUDIT_CHANNEL_ID=     # Where audit reports post
AUDIT_CRON_SCHEDULE=  # Cron expression for weekly audit
```

### Useful Queries
```sql
-- Find all verified brothers
SELECT * FROM users WHERE status = 'BROTHER';

-- Check pending verifications
SELECT * FROM verification_tickets WHERE status = 'PENDING';

-- Find brothers by industry
SELECT * FROM users WHERE industry LIKE '%Tech%' AND status = 'BROTHER';
```
