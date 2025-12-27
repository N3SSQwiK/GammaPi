# Change: Add Audit Automation Scheduler

## Why
Currently, the `/audit` command must be triggered manually by an administrator. To ensure continuous compliance and security, the audit process should be automated to run on a regular schedule (e.g., weekly), providing proactive monitoring without human intervention.

## What Changes
- Install `node-cron` dependency.
- Implement a `Scheduler` module to handle recurring tasks.
- Configure a weekly automated audit that posts its report to a designated administrative channel.
- Add `AUDIT_CHANNEL_ID` to the configuration.

## Impact
- **Affected Specs:**
    - `audit-automation`: New capability for scheduled audits.
- **Affected Code:**
    - `src/index.ts` (to initialize the scheduler)
    - `src/lib/scheduler.ts` (new)
    - `src/modules/audit/auditHandler.ts` (modified to support non-interaction triggers)
    - `package.json` (new dependency)
