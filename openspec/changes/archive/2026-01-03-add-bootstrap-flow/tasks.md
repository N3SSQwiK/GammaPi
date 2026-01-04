## 1. Implementation

- [ ] 1.1 Add `countBrothers()` method to userRepository
- [ ] 1.2 Create `/bootstrap` slash command with modal flow
- [ ] 1.3 Validate server owner permission (guild.ownerId)
- [ ] 1.4 Reject if 2+ brothers already exist
- [ ] 1.5 Collect identity info: first_name, last_name, don_name, chapter, industry, initiation year/semester
- [ ] 1.6 Create user record with status='BROTHER' and chapter='gamma-pi'
- [ ] 1.7 Assign `🦁 ΓΠ Brother` role to user
- [ ] 1.8 Log bootstrap event for audit
- [ ] 1.9 Register command in index.ts
- [ ] 1.10 Run `npm run deploy` to register slash command

## 2. Testing

- [ ] 2.1 Test command as non-owner (should reject)
- [ ] 2.2 Test command as owner on fresh database (should succeed)
- [ ] 2.3 Test command when 2+ brothers exist (should reject)
- [ ] 2.4 Verify user receives BROTHER status and role
