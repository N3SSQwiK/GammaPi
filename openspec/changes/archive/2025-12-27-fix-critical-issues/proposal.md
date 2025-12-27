# Change: Fix Critical Issues from Code Review

## Why
A comprehensive code review identified several critical implementation gaps that prevent the bot from functioning as intended. Specifically, the verification flow relies on hardcoded stubs, the attendance module fails to persist data, and the startup sequence has race conditions.

## What Changes
- **Configuration:** Add `VERIFICATION_CHANNEL_ID` to environment and config.
- **Startup:** Refactor `index.ts` to await dynamic imports before login.
- **Access Module:**
  - Implement real DB transactions for the dual-voucher system.
  - Wire up the "Brother Application" modal to post an embed to the Admin Channel.
  - Implement actual Role Granting upon 2nd verification.
- **Operations Module:**
  - Update `/attendance` to persist attendee User IDs to the database `attendance` table.

## Impact
- **Affected Specs:**
    - `bot-core`: Startup reliability.
    - `access-control`: Verification completeness.
    - `operations`: Attendance persistence.
- **Affected Code:**
    - `src/index.ts`
    - `src/config.ts`
    - `src/modules/access/accessHandler.ts`
    - `src/commands/attendance.ts`
