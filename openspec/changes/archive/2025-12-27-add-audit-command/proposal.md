# Change: Add Server Audit Command

## Why
As the Discord server grows, manual configuration drift is inevitable. We need a programmatic way to validate that the "Reality" (Discord Server State) matches the "Truth" (Documentation/Specs), ensuring security (Permissions) and structure (Channels/Tags) remain compliant.

## What Changes
- Implement a new module `modules/audit/`.
- Create `serverConfig.ts` to store the "Expected State" (Roles, Permissions, Channels, Tags).
- Create `/audit` Slash Command (Admin Only).
- Implement logic to fetch Server Data via Discord.js and compare against Config.
- Generate a "Pass/Fail" Embed Report.

## Impact
- **Affected Specs:**
    - `audit`: New capability.
- **Affected Code:**
    - `src/modules/audit/auditHandler.ts`
    - `src/commands/audit.ts`
