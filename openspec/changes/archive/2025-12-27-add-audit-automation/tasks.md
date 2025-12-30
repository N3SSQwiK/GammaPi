# Tasks: Add Audit Automation Scheduler

## 1. Preparation
- [x] 1.1 Install `node-cron` and `@types/node-cron`.
- [x] 1.2 Add `AUDIT_CHANNEL_ID` and `AUDIT_CRON_SCHEDULE` to `.env` and `src/config.ts`.

## 2. Implementation
- [x] 2.1 Refactor `src/modules/audit/auditHandler.ts` to separate the core audit logic from the Discord interaction (so it can be called by the scheduler).
- [x] 2.2 Create `src/lib/scheduler.ts` to manage cron jobs.
- [x] 2.3 Implement the weekly audit job in the scheduler.
- [x] 2.4 Initialize the scheduler in `src/index.ts`.

## 3. Verification
- [x] 3.1 Verify that the `/audit` command still works correctly.
- [x] 3.2 (Test) Trigger the scheduled audit manually or with a short-interval cron for verification.

---
**Status**: 8/8 tasks completed (100%). Weekly audit automation fully operational.
