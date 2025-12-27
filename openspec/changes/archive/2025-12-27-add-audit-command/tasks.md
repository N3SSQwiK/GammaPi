# Tasks: Add Server Audit Command

## 1. Audit Infrastructure
- [ ] 1.1 Create `src/modules/audit/serverConfig.ts` defining expected Roles, Channels, and Tags.
- [ ] 1.2 Create `src/modules/audit/auditHandler.ts` with comparison logic.
- [ ] 1.3 Create `src/commands/audit.ts`.

## 2. Validation Logic
- [ ] 2.1 Implement Role Checker (Existence + Critical Perms).
- [ ] 2.2 Implement Channel Checker (Existence + Type + Parent Category).
- [ ] 2.3 Implement Permission Override Checker (e.g., ensure Treasury is private).
- [ ] 2.4 Implement Forum Tag Checker.
