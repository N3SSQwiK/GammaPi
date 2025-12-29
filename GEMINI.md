# Gamma Pi: Digital Chapter Hub

## Project Overview

This repository serves as the central hub for the **Gamma Pi Graduate/Professional Chapter** of **Phi Iota Alpha Fraternity**. It houses the custom software, automation workflows, and strategic documentation required to migrate chapter operations to a modern, automated Discord environment.

The primary goal is to foster professional engagement, streamline internal business, and enhance public visibility via LinkedIn, moving away from legacy tools like WhatsApp for core operations.

### Key Components

*   **FiotaBot (`fiota-bot/`):** A custom Discord bot built with Node.js and TypeScript. It handles:
    *   **Identity Management:** Dual-voucher verification for new members.
    *   **Operations:** Attendance tracking, voting, and mentorship toggles.
    *   **Automation:** Weekly server audits and "Golden State" configuration enforcement.
    *   **Networking:** A searchable "Rolodex" of brothers by industry.
*   **PillarFunFacts (`PillarFunFacts/`):** Automation workflows (n8n) that post daily historical facts enriched by AI (Google Gemini) to keep the brotherhood grounded in its history.
*   **Strategic Documentation:** Comprehensive guides on migration strategy, permissions, and operational runbooks.

## Building and Running (FiotaBot)

The bot is designed to be self-hosted on a VPS (e.g., Hostinger).

### Prerequisites
*   Node.js (LTS)
*   npm
*   A Discord Bot Token and Client ID

### Setup & Run
1.  **Navigate to the bot directory:**
    ```bash
    cd fiota-bot
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment:**
    Create a `.env` file based on the SOP requirements:
    ```env
    DISCORD_TOKEN=your_token
    CLIENT_ID=your_client_id
    GUILD_ID=your_server_id
    VERIFICATION_CHANNEL_ID=your_channel_id
    AUDIT_CHANNEL_ID=your_channel_id
    ```
4.  **Build the project:**
    ```bash
    npm run build
    ```
5.  **Deploy Slash Commands (First run only):**
    ```bash
    npm run deploy
    ```
6.  **Start the bot:**
    ```bash
    npm start
    ```
    *(For production, use `pm2 start dist/index.js`)*

## Development Conventions

*   **Language:** TypeScript (Strict mode enabled).
*   **Architecture:** Modular design separating `commands`, `modules` (business logic), and `lib` (infrastructure/repositories).
*   **Database:** SQLite (`better-sqlite3`) using the Repository Pattern for all data access.
*   **Infrastructure as Code:** Server structure (Roles, Channels) is defined in `serverConfig.ts` and enforced via the `/setup` and `/audit` commands.
*   **Spec-Driven:** All changes follow the **OpenSpec** workflow (`openspec/`), requiring a proposal and validation before implementation.

## Key Files & Directories

*   `fiota-bot/src/index.ts`: The entry point for the Discord bot.
*   `fiota-bot/src/modules/audit/serverConfig.ts`: The "Golden State" configuration defining required roles and channels.
*   `fiota-bot/src/lib/repositories/`: Data access layer for Users, Votes, and Attendance.
*   `PillarFunFacts/n8n_workflow_v2.json`: The main n8n workflow for AI-generated history posts.
*   `GammaPi_Discord_Migration_Report.md`: The strategic master plan for the community migration.
*   `FiotaBot_Implementation_SOP.md`: Detailed step-by-step guide for server administrators.
