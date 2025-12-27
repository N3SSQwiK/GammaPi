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
*   **Server Audit**: Programmatic validation of permissions, channels, and tags via `/audit`.

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

### Deployment Quick-Start
1.  **FiotaBot**: See `FiotaBot_Implementation_SOP.md`.
2.  **n8n**: Import `.json` files from `PillarFunFacts/` into your n8n instance and configure your Gemini API Key.

---
**Gamma Pi Chapter** | *SPJP*
