# Change: Extract Golden State to JSON

## Why
Currently, the "Golden State" configuration (Roles, Channels, Forums) is hardcoded in `src/modules/audit/serverConfig.ts`. This makes it difficult for non-developers to review or modify the server specification. Furthermore, advanced Forum settings (like `requireTag`, `defaultSortOrder`) are missing from the current schema.

## What Changes
- Create `server-config.json` at the project root to serve as the single source of truth.
- Update `serverConfig.ts` to import and type-check this JSON file.
- Expand the Configuration Schema to include advanced Discord Channel options:
    - `requireTag`: Boolean
    - `defaultSortOrder`: String ('LATEST_ACTIVITY' | 'CREATION_DATE')
    - `defaultAutoArchiveDuration`: Integer (60, 1440, 4320, 10080)
    - `rateLimitPerUser`: Integer (seconds)
    - `nsfw`: Boolean
- Create `GOLDEN_STATE_REFERENCE.md` documenting these options for future admins.

## Impact
- **Affected Specs:**
    - `bot-core`: Configuration management requirement.
- **Affected Code:**
    - `src/modules/audit/serverConfig.ts`
    - `src/modules/audit/setupHandler.ts` (to apply new settings)
    - `src/modules/audit/auditHandler.ts` (to validate new settings)
