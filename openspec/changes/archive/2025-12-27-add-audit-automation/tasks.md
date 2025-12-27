# Tasks: Add Audit Automation Scheduler

## 1. Preparation
- [ ] 1.1 Install `node-cron` and `@types/node-cron`.
- [ ] 1.2 Add `AUDIT_CHANNEL_ID` and `AUDIT_CRON_SCHEDULE` to `.env` and `src/config.ts`.

## 2. Implementation
- [ ] 2.1 Refactor `src/modules/audit/auditHandler.ts` to separate the core audit logic from the Discord interaction (so it can be called by the scheduler).
- [ ] 2.2 Create `src/lib/scheduler.ts` to manage cron jobs.
- [ ] 2.3 Implement the weekly audit job in the scheduler.
- [ ] 2.4 Initialize the scheduler in `src/index.ts`.

## 3. Verification
- [ ] 3.1 Verify that the `/audit` command still works correctly.
- [ ] 3.2 (Test) Trigger the scheduled audit manually or with a short-interval cron for verification.
