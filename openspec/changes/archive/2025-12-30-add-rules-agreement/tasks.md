# Tasks: Add Rules Agreement Module

> **✅ COMPLETED**: Originally archived incorrectly on 2025-12-27, unarchived and implemented on 2025-12-30.

## 1. Schema & Config
- [x] 1.1 Update `serverConfig.ts` to include `#rules-and-conduct` and the `✅ Rules Accepted` role.
- [x] 1.2 Update `src/lib/db.ts` to add `rules_agreed_at` (timestamp) to the `users` table.
- [x] 1.3 Update `userRepository.ts` to support updating the agreement timestamp.

## 2. Rules Logic
- [x] 2.1 Create `src/modules/access/rulesHandler.ts`.
- [x] 2.2 Implement `handleRulesButton` logic:
    - Check if user already agreed.
    - Add `✅ Rules Accepted` role.
    - Log timestamp to DB.
    - Send ephemeral "Welcome" confirmation with next steps.

## 3. Deployment
- [x] 3.1 Create `src/commands/rules.ts` (Admin only) to post the embed.
- [x] 3.2 Update `interactionCreate.ts` to route the button click.

## 4. Additional Enhancements (Beyond Original Scope)
- [x] 4.1 Improved `/verify` command with clearer UX explaining Brother vs Guest paths.
- [x] 4.2 Added `hasAgreedToRules()` method to userRepository for checking agreement status.
- [x] 4.3 Added `recordRulesAgreement()` method with ISO timestamp recording.

---
**Status**: 9/9 tasks completed (100%) + 3 bonus enhancements. Ready for archiving.

## Implementation Notes

### User Flow
1. User joins server → lands in `#rules-and-conduct`
2. User reads Code of Conduct and clicks "✅ I Agree"
3. User receives `✅ Rules Accepted` role → unlocks `#welcome-gate`
4. User sees improved verification screen with clear Brother/Guest explanations
5. User selects appropriate path and completes verification

### Code of Conduct Sections
- 🤝 Respect & Dignity
- 💼 Professionalism
- 🚫 Prohibited Behavior
- ⚠️ Enforcement

### Future Enhancements (Separate Proposal)
- Automated moderation/enforcement
- IP/device tracking (requires web OAuth flow)
