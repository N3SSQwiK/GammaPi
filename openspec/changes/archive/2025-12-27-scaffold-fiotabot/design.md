# Design: FiotaBot Architecture

## Context
FiotaBot will be self-hosted on a Hostinger VPS alongside an existing n8n instance. It serves the Gamma Pi Graduate Chapter of Phi Iota Alpha.

## Goals
- **Self-Contained:** Minimal external dependencies (SQLite instead of Postgres).
- **Secure:** Role-Based Access Control (RBAC) enforced by code.
- **Maintainable:** Clear separation of commands, events, and logic.

## Architecture
- **Language:** Node.js (TypeScript) for strong typing and ease of use with `discord.js`.
- **Framework:** `discord.js` (latest version) interaction-first design (Slash Commands).
- **Database:** `better-sqlite3` for local, fast, file-based storage.
- **Project Structure:**
    ```
    src/
      ├── commands/       # Slash command definitions
      ├── events/         # Event listeners (ready, interactionCreate)
      ├── lib/            # Shared utilities (database, config)
      ├── modules/        # Domain logic
      │   ├── access/     # Verification, LinkedIn
      │   ├── identity/   # Line Roles, Visitor logic
      │   ├── networking/ # Rolodex, Mentorship
      │   ├── operations/ # Voting, Attendance
      │   └── pipeline/   # Candidate Status, Committee logic
      └── index.ts        # Entry point
    ```

## Automation Architecture (n8n)
- **External Integration:** The bot will expose a read-only endpoint or utilize n8n's Discord nodes to fetch announcements.
- **Weekly Digest:** n8n will run a cron job every Friday at 4 PM, query Discord for the week's top messages, and use the MS Office (Outlook) node to blast the digest to the member list.

## Decisions
- **Decision:** Use `sqlite3` over `PostgreSQL`.
    - **Rationale:** The dataset (users, attendance) is small (<1000 records/year). SQLite simplifies backup (just copy the file) and reduces hosting complexity.
- **Decision:** Use "Dual-Voucher" for verification.
    - **Rationale:** Mimics fraternity protocol. Requires active brother participation, increasing security.
- **Decision:** Stub LinkedIn OAuth initially.
    - **Rationale:** Full OAuth requires a public HTTPS endpoint. We will implement the logic but mock the callback for the initial prototype.
- **Decision:** Use Discord Roles for Line Identity.
    - **Rationale:** Allows for visual distinction in chat (Role Colors) and easy mentioning (e.g., `@Alpha Line`). Data is mirrored in SQLite for history, but Discord is the UI.

## Risks
- **Data Loss:** SQLite is a single file. Mitigation: Backup cron job to another directory/cloud.
- **Bot Downtime:** If the process dies, features stop. Mitigation: Use `pm2` for process management.
