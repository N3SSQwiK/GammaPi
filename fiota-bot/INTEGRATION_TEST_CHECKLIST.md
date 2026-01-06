# FiotaBot Integration Test Checklist

**Version:** 1.0
**Last Updated:** January 2026

Use this checklist when deploying FiotaBot to verify all verification flows work correctly.

---

## Prerequisites

- [ ] Bot is running (`pm2 status FiotaBot` shows "online")
- [ ] Slash commands are registered (`npm run deploy` was run)
- [ ] You have access to a test Discord server
- [ ] You have at least one test account (or can use your own)

---

## Test 16.1: /verify-start Happy Path

**Goal:** Verify the complete brother verification flow works end-to-end.

### Steps

1. [ ] **Agree to Rules First**
   - Go to `#rules-and-conduct`
   - Click `[✅ I Agree to the Code of Conduct]`
   - Verify: You receive `✅ Rules Accepted` role

2. [ ] **Start Verification**
   - Go to `#welcome-gate`
   - Type `/verify-start`
   - Verify: Chapter autocomplete appears (type "gamma" to test search)

3. [ ] **Select Chapter**
   - Select `Gamma Pi - Graduate Chapter`
   - Verify: Industry autocomplete appears

4. [ ] **Select Industry**
   - Select `Technology / Software Engineering`
   - Verify: Modal 1 appears

5. [ ] **Fill Modal 1 (Identity)**
   - First Name: `Test`
   - Last Name: `Brother`
   - Don Name: `Phoenix`
   - Year & Semester: `2015 Spring`
   - Job Title: `Software Engineer`
   - Click Submit
   - Verify: Confirmation message with "Continue to Step 2" button appears

6. [ ] **Fill Modal 2 (Contact & Vouchers)**
   - Click "Continue to Step 2"
   - Phone Number: `(555) 123-4567`
   - Zip Code or City: `New York` or `10001`
   - Voucher 1 Name: `[Name of existing brother]`
   - Voucher 2 Name: `[Name of another existing brother]`
   - Click Submit
   - Verify: Success message with ticket ID appears

7. [ ] **Check Verification Channel**
   - Go to `#verification-requests` (or your configured channel)
   - Verify: Ticket embed appears with all entered information
   - Verify: Approve button is visible

### Expected Results
- [ ] User data saved to database
- [ ] Ticket created with PENDING status
- [ ] Embed shows correct name format: "Don Phoenix (Test Brother)"

---

## Test 16.2: /init Founding Brother Flow

**Goal:** Verify server initialization and founding brother registration.

> **Note:** This test requires a fresh server or clearing the database.

### Steps

1. [ ] **Prepare Fresh Environment**
   - Either: Create new test server
   - Or: Clear database (`rm fiota.db` and restart bot)

2. [ ] **Run /init as Server Owner**
   - Type `/init chapter:Gamma Pi industry:Technology / Software Engineering`
   - Verify: Setup completes (roles/channels created)
   - Verify: "Light the Torch" button appears

3. [ ] **Register Founding Brother**
   - Click "🦁 Light the Torch"
   - Fill Modal 1 (same fields as 16.1)
   - Click "Continue to Step 2"
   - Fill Modal 2 (Phone, City only - no vouchers needed)
   - Click Submit

### Expected Results
- [ ] User receives `🦁 ΓΠ Brother` role immediately (no voucher approval needed)
- [ ] Rules embed posted to `#rules-and-conduct`
- [ ] Verification gate posted to `#welcome-gate`
- [ ] Database shows user with status='BROTHER'

---

## Test 16.3: Voucher Approval Flow

**Goal:** Verify the dual-approval system works correctly.

### Prerequisites
- At least 2 brothers exist in the database
- A pending verification ticket exists

### Steps

1. [ ] **First Approval**
   - Log in as a brother (not the applicant)
   - Go to verification channel
   - Click "Approve" on the pending ticket
   - Verify: Message shows "1/2 approvals"
   - Verify: Embed updates to show first approver

2. [ ] **Second Approval**
   - Log in as a different brother
   - Click "Approve" on the same ticket
   - Verify: Message shows verification complete

### Expected Results
- [ ] After 2 approvals, applicant receives `🦁 ΓΠ Brother` role
- [ ] Ticket status changes to VERIFIED
- [ ] User status changes to BROTHER in database

---

## Test 16.4: /verify-override (E-Board)

**Goal:** Verify E-Board can bypass voucher requirements.

### Prerequisites
- A pending verification ticket exists
- You have Administrator permission

### Steps

1. [ ] **Get Ticket ID**
   - Note the ticket ID from a pending verification embed

2. [ ] **Run Override**
   - Type `/verify-override ticket_id:[TICKET_ID]`
   - Verify: Success message appears

### Expected Results
- [ ] Applicant immediately receives `🦁 ΓΠ Brother` role
- [ ] Ticket status changes to OVERRIDDEN
- [ ] No voucher approvals required

---

## Test 16.5: /chapter-assign (Omega)

**Goal:** Verify E-Board can assign special chapters including Omega.

### Prerequisites
- A verified brother exists
- You have Administrator permission

### Steps

1. [ ] **Assign Omega Chapter**
   - Type `/chapter-assign user:@[Brother] chapter:Omega`
   - Verify: Omega appears in autocomplete (it's hidden from /verify-start)
   - Verify: Success message confirms assignment

2. [ ] **Verify Database**
   ```sql
   SELECT discord_id, chapter FROM users WHERE chapter = 'omega';
   ```

### Expected Results
- [ ] User's chapter updated to 'omega'
- [ ] Omega was visible in /chapter-assign autocomplete
- [ ] Omega is NOT visible in /verify-start autocomplete

---

## Test 16.6: Error Cases

**Goal:** Verify validation catches invalid inputs.

### Test 16.6.1: Invalid Year Format

1. [ ] Run `/verify-start`, select chapter/industry
2. [ ] In Modal 1, enter Year & Semester: `2015` (missing semester)
3. [ ] Submit
4. [ ] Verify: Error message about format "YYYY Spring" or "YYYY Fall"

### Test 16.6.2: Invalid Phone Number

1. [ ] Get to Modal 2
2. [ ] Enter Phone: `555-CALL` (contains letters)
3. [ ] Submit
4. [ ] Verify: Error message about phone format

### Test 16.6.3: Non-Existent Voucher

1. [ ] Get to Modal 2
2. [ ] Enter Voucher 1: `Nonexistent Person Who Doesnt Exist`
3. [ ] Submit
4. [ ] Verify: Error message that voucher was not found

### Test 16.6.4: Year Before 1931

1. [ ] In Modal 1, enter Year & Semester: `1930 Spring`
2. [ ] Submit
3. [ ] Verify: Error (fraternity founded 1931)

### Test 16.6.5: Future Year

1. [ ] In Modal 1, enter Year & Semester: `2030 Spring`
2. [ ] Submit
3. [ ] Verify: Error (cannot be in the future)

---

## Post-Test Cleanup

After testing, you may want to:

1. [ ] Remove test users from database
   ```sql
   DELETE FROM users WHERE first_name = 'Test';
   DELETE FROM verification_tickets WHERE named_voucher_1 LIKE '%Test%';
   ```

2. [ ] Or keep test data for future reference

---

## Test Results Log

| Test | Date | Tester | Pass/Fail | Notes |
|------|------|--------|-----------|-------|
| 16.1 | | | | |
| 16.2 | | | | |
| 16.3 | | | | |
| 16.4 | | | | |
| 16.5 | | | | |
| 16.6.1 | | | | |
| 16.6.2 | | | | |
| 16.6.3 | | | | |
| 16.6.4 | | | | |
| 16.6.5 | | | | |

---

**Maintained by Gamma Pi Tech Chair**
