# Gamma Pi: Digital Chapter Hub (Phi Iota Alpha)

This project serves as the central repository for the digital migration, engagement, and management of the **Gamma Pi Graduate/Professional Chapter** of Phi Iota Alpha Fraternity.

## 🚀 Overview
We are moving chapter operations to Discord to foster professional engagement, streamline internal business, and enhance our public visibility via LinkedIn. This repository contains the custom automation (n8n), the chapter management bot (FiotaBot), and all strategic documentation.

## 🤖 Software & Automation

### 🦁 FiotaBot (Chapter Management)
Located in `fiota-bot/`, this custom Discord bot (Node.js/TypeScript) handles the chapter's core "Identity and Operations."
*   **Dual-Voucher Verification**: Secure onboarding requiring 2 ΓΠ brothers to approve new members.
*   **Professional Rolodex**: Searchable database of brothers by Industry and Job Title (`/find`).
*   **Pipeline Tracking**: Status management for Candidates and Interests (`/pipeline`).
*   **Chapter Ops**: Integrated commands for `/attendance`, `/vote`, and `/mentor` toggles.
*   **Geographic Profiles**: Automatic derivation of City/State/Timezone from Zip Codes.
*   **Server Audit**: Programmatic validation of permissions, channels, and tags via `/audit` or **Weekly Automated Check**.

### 🏛️ PillarFunFacts (Historical Engagement)
Located in `PillarFunFacts/`, these n8n workflows provide daily historical content to keep the brotherhood grounded in our history.
*   **AI Enhancement**: Uses Google Gemini to find specific "nuggets" of wisdom from our 5 Pillars.
*   **Multi-Source**: Combines internal seed lists with Wikipedia data.

## 📄 Strategic Documentation
Essential guides for chapter leadership and tech chairs:
*   **[Migration Strategy](GammaPi_Discord_Migration_Report.md)**: The "Why" and "How" of our move to Discord.
*   **[Implementation SOP](FiotaBot_Implementation_SOP.md)**: Granular, step-by-step guide for deploying FiotaBot on Hostinger.
*   **[Platform Comparison](Discord_vs_WhatsApp_Comparison.md)**: Analysis of why Discord was chosen over WhatsApp.
*   **[Technical Spec](FiotaBot_Spec.md)**: Deep dive into the bot's architecture and schema.

## 🛠️ Development & Specs
This project utilizes **OpenSpec** for spec-driven development.
*   All requirements and scenarios are documented in `openspec/specs/`.
*   Changes are proposed and tracked in `openspec/changes/`.

## 🗺️ Roadmap & Planned Features

Active proposals in `openspec/changes/` for upcoming features:

### Engagement Features
| Proposal | Description | Status |
|----------|-------------|--------|
| **Interactive Content** | Pop Quiz trivia, Brother Spotlight rotation, Industry Pulse discussions | 📋 Proposed |
| **Gamification System** | Achievement badges, structured Wins channel, quarterly roundups | 📋 Proposed |
| **Networking Automation** | Office Hours Roulette (monthly coffee chats), geographic clustering for local meetups | 📋 Proposed |
| **Engagement Infrastructure** | Weekly Pulse email digest, Knowledge Vault crowdsourced tips forum | 📋 Proposed |
| **LinkedIn Bridge** | Career milestone detection, chapter content amplification, OAuth verification | 📋 Proposed |

### Core Improvements
| Proposal | Description | Status |
|----------|-------------|--------|
| **Enhanced Verification UX** | Multi-step flow with chapter/industry dropdowns, don name tracking, international address support | 📋 Proposed |

See individual proposals in `openspec/changes/` for full specifications and implementation tasks.

## ⚡ Day 0: Server Provisioning (Quick Setup)
If you are starting with a blank Discord server, follow these steps to build the infrastructure in seconds:

1.  **Invite the Bot**: Use the [Discord Developer Portal](https://discord.com/developers/applications) to generate an invite link for FiotaBot with `Administrator` and `applications.commands` scopes.
2.  **Go Online**: SSH into your Hostinger VPS, `cd fiota-bot`, and run `pm2 start dist/index.js`.
3.  **Run Construction**: In Discord, type `/setup`. The bot will automatically create all Roles, Forum Channels, and Tags defined in the chapter spec.
4.  **Audit**: Run `/audit` to verify that all security permissions are correctly implemented.

Detailed instructions are available in the **[Implementation SOP](FiotaBot_Implementation_SOP.md)**.

---
**Gamma Pi Chapter** | *Semper Parati, Semper Juncti.*
