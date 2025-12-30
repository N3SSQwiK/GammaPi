# Tasks: Add Server Audit Command

## 1. Audit Infrastructure
- [x] 1.1 Create `src/modules/audit/serverConfig.ts` defining expected Roles, Channels, and Tags.
- [x] 1.2 Create `src/modules/audit/auditHandler.ts` with comparison logic.
- [x] 1.3 Create `src/commands/audit.ts`.

## 2. Validation Logic
- [x] 2.1 Implement Role Checker (Existence + Critical Perms).
- [x] 2.2 Implement Channel Checker (Existence + Type + Parent Category).
- [ ] 2.3 Implement Permission Override Checker (e.g., ensure Treasury is private).
- [x] 2.4 Implement Forum Tag Checker.

---
**Status**: 6/7 tasks completed (86%). Permission override checker deferred (no Treasury channel yet).
