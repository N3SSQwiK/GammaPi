# Change: Scaffold FiotaBot

## Why
Gamma Pi chapter requires a custom Discord bot to manage member verification (differentiating between Brothers, Alumni, and Public), automate chapter operations (attendance, voting), and integrate with external professional networks (LinkedIn). The current manual processes are unscalable and lack security.

## What Changes
- Initialize a new Node.js/TypeScript project for "FiotaBot".
- Implement the core bot infrastructure (Discord.js client, Event Handler).
- Implement the **Access Control Module** (Welcome Gate, Dual-Voucher System, LinkedIn OAuth Stub).
- Implement the **Chapter Operations Module** (Attendance, Voting).
- Implement the **Identity Module** (Line Management, Visiting Brothers, Zip Code).
- Implement the **Pipeline Module** (Candidate Status, Committee Permissions).
- Implement the **Networking Module** (Professional Rolodex, Mentorship).
- Create a local SQLite database for persistence.

## Impact
- **Affected Specs:**
    - `bot-core`: New capability for basic bot connectivity.
    - `access-control`: New capability for verifying users.
    - `operations`: New capability for meetings and voting.
    - `identity`: New capability for Line Roles and Visiting Brothers.
    - `pipeline`: New capability for Candidate Status tracking.
    - `networking`: New capability for Professional Search and Mentorship.
- **Affected Code:**
    - New directory `src/` (or `bot/`) containing the bot source code.
    - `package.json` for dependencies.
    - `.env` for secrets (local only).
