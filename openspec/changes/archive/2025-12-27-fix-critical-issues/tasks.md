# Tasks: Fix Critical Issues

## 1. Core & Config
- [x] 1.1 Update `src/config.ts` to include `VERIFICATION_CHANNEL_ID`.
- [x] 1.2 Refactor `src/index.ts` to use `await Promise.all()` for command/event loading.
- [x] 1.3 Add graceful shutdown handler (`SIGINT/SIGTERM`) to close DB connection.

## 2. Access Module (Verification)
- [x] 2.1 Update `accessHandler.ts`: Replace stub `adminChannelId` with config value.
- [x] 2.2 Update `accessHandler.ts`: Implement `channel.send({ embeds: ... })` for the Verification Ticket.
- [x] 2.3 Update `accessHandler.ts`: Implement `db.transaction` for the "Approve" button to prevent race conditions.
- [x] 2.4 Update `accessHandler.ts`: Implement `member.roles.add()` to grant the `🦁 ΓΠ Brother` role on success.

## 3. Operations Module (Attendance)
- [x] 3.1 Update `attendance.ts`: Fetch current `attendees` JSON from DB, parse, push new User ID, stringify, and update DB.

---
**Status**: 8/8 tasks completed (100%). All critical issues resolved.
