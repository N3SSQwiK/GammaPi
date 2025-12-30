# Tasks: Add Rules Agreement Module

> **⚠️ UNARCHIVED**: This proposal was incorrectly archived on 2025-12-27 without any implementation. Restored to active changes on 2025-12-30.

## 1. Schema & Config
- [ ] 1.1 Update `serverConfig.ts` to include `#rules-and-conduct` and the `✅ Rules Accepted` role.
- [ ] 1.2 Update `src/lib/db.ts` to add `rules_agreed_at` (timestamp) to the `users` table.
- [ ] 1.3 Update `userRepository.ts` to support updating the agreement timestamp.

## 2. Rules Logic
- [ ] 2.1 Create `src/modules/access/rulesHandler.ts`.
- [ ] 2.2 Implement `handleRulesButton` logic:
    - Check if user is verified.
    - Add `✅ Rules Accepted` role.
    - Log timestamp to DB.
    - Send ephemeral "Welcome" confirmation.

## 3. Deployment
- [ ] 3.1 Create `src/commands/rules.ts` (Admin only) to post the embed.
- [ ] 3.2 Update `interactionCreate.ts` to route the button click.

---
**Status**: 0/9 tasks completed (0%). No implementation exists - this was incorrectly archived.
