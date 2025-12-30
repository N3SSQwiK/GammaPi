# Tasks: Extract Golden State to JSON

> **⚠️ UNARCHIVED**: This proposal was archived on 2025-12-27 but only partially implemented. The team chose to keep TypeScript config instead of JSON. Restored to active changes on 2025-12-30 for decision: complete JSON extraction or document why TypeScript approach was chosen.

## 1. Documentation
- [ ] 1.1 Create `GOLDEN_STATE_REFERENCE.md` detailing the schema and available Discord channel options.

## 2. Configuration
- [x] 2.1 Create `fiota-bot/server-config.json` with the current configuration, adding `requireTag: true` to Forum channels.
  - **Partial**: `requireTag: true` exists in TypeScript config, but JSON file was never created.
- [ ] 2.2 Refactor `src/modules/audit/serverConfig.ts` to load this JSON file.
  - **Not done**: Config remains TypeScript-only.

## 3. Implementation
- [x] 3.1 Update `setupHandler.ts` to apply `defaultSortOrder`, `rateLimitPerUser`, and `nsfw` settings if provided in the JSON.
  - **Partial**: Some settings exist but not loaded from JSON.
- [ ] 3.2 Update `auditHandler.ts` to validate these new properties against the live server state.

---
**Status**: 2/5 tasks completed (40%). Decision needed: complete JSON extraction or close with documented rationale for TypeScript approach.
