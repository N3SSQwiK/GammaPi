# Tasks: Extract Golden State to JSON

## 1. Documentation
- [ ] 1.1 Create `GOLDEN_STATE_REFERENCE.md` detailing the schema and available Discord channel options.

## 2. Configuration
- [ ] 2.1 Create `fiota-bot/server-config.json` with the current configuration, adding `requireTag: true` to Forum channels.
- [ ] 2.2 Refactor `src/modules/audit/serverConfig.ts` to load this JSON file.

## 3. Implementation
- [ ] 3.1 Update `setupHandler.ts` to apply `defaultSortOrder`, `rateLimitPerUser`, and `nsfw` settings if provided in the JSON.
- [ ] 3.2 Update `auditHandler.ts` to validate these new properties against the live server state.
