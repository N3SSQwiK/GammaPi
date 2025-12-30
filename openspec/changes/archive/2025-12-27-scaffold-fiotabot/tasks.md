# Tasks: Scaffold FiotaBot

## 1. Project Initialization
- [x] 1.1 Initialize `package.json` and install dependencies (`discord.js`, `better-sqlite3`, `dotenv`, `typescript`, `ts-node`).
- [x] 1.2 Initialize TypeScript configuration (`tsconfig.json`).
- [x] 1.3 Create project folder structure (`src/commands`, `src/events`, `src/modules`).
- [x] 1.4 Create `src/lib/db.ts` to initialize SQLite schema (Users, Attendance tables).

## 2. Core Infrastructure
- [x] 2.1 Implement `src/index.ts` (Bot entry point, client login).
- [x] 2.2 Implement Command Handler (dynamic loader).
- [x] 2.3 Implement Event Handler (dynamic loader).

## 3. Access Control Module
- [x] 3.1 Implement `/verify` command (starts the interaction).
- [x] 3.2 Implement "Brother Application" Modal.
- [x] 3.3 Implement "Voucher Ticket" Logic (posting to `#pending-verification`).
- [x] 3.4 Implement "Approve" Button Handler (Dual-vote logic).
- [x] 3.5 Implement "Guest Access" Button (LinkedIn Link Generator - Stub).

## 4. Operations Module
- [x] 4.1 Implement `/attendance` command (creates button).
- [x] 4.2 Implement Attendance Button Handler (logs user).
- [x] 4.3 Implement `/vote` command (creates poll embed).

## 5. Pipeline & Identity Module
- [x] 5.1 Implement `/pipeline` command (status updates).
- [x] 5.2 Configure Roles for "Line Committee" vs "General Brother".
- [x] 5.3 Implement `/cross` command (bulk role assignment for new lines).
- [x] 5.4 Update Verification logic to support "Visiting Brother" distinction.
- [x] 5.5 Implement Zip Code Resolver (Zip -> City/Timezone) and Profile Update.

## 6. Networking Module
- [x] 6.1 Implement `/find` command (Professional Rolodex).
- [x] 6.2 Implement `/mentor` command (Role toggle).
- [x] 6.3 Update Verification Modal to include Industry/Job Title fields.

## 7. Automation (n8n)
- [ ] 7.1 Configure n8n workflow to scrape Discord `#announcements` and `#events`.
- [ ] 7.2 Implement "Weekly Digest" email template and Friday afternoon trigger.

---
**Status**: 20/22 tasks completed (91%). n8n weekly digest tasks deferred to `add-engagement-infrastructure` proposal.
