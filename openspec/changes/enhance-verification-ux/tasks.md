# Implementation Tasks: Enhanced Verification UX

## 1. Data Preparation & Constants
- [ ] 1.1 Manually extract chapter list from phiota.org/chapters
- [ ] 1.2 Create CHAPTERS constant in `src/lib/constants.ts`:
  - [ ] Format: `{ value: 'gamma-pi', label: 'Gamma Pi - Graduate Chapter', hidden: false }`
  - [ ] Include all active undergraduate, graduate, and alumni chapters
  - [ ] Add Omega chapter with `hidden: true` flag
  - [ ] Sort alphabetically by Greek letter
- [ ] 1.3 Create INDUSTRIES constant with 50 NAICS-based categories:
  - [ ] Tech/Software, Finance/Banking, Healthcare/Medical, Legal, Education, Government, etc.
  - [ ] Include "Other (please specify in notes)" as final option
  - [ ] Map old industry free-text to new standardized values for migration
- [ ] 1.4 Document chapter list update process in Tech Chair Runbook

## 2. Database Schema Migration
- [ ] 2.1 Create migration script: `migrations/001_enhance_user_schema.sql`
- [ ] 2.2 Add name fields:
  ```sql
  ALTER TABLE users ADD COLUMN first_name TEXT;
  ALTER TABLE users ADD COLUMN middle_name TEXT;
  ALTER TABLE users ADD COLUMN last_name TEXT;
  ALTER TABLE users ADD COLUMN don_name TEXT;
  ```
- [ ] 2.3 Add contact fields:
  ```sql
  ALTER TABLE users ADD COLUMN phone_number TEXT;
  ```
- [ ] 2.4 Add location fields:
  ```sql
  ALTER TABLE users ADD COLUMN city TEXT;
  ALTER TABLE users ADD COLUMN state_province TEXT;
  ALTER TABLE users ADD COLUMN country TEXT DEFAULT 'United States';
  ```
- [ ] 2.5 Add verification metadata fields:
  ```sql
  ALTER TABLE users ADD COLUMN chapter TEXT;
  ALTER TABLE users ADD COLUMN initiation_year INTEGER;
  ALTER TABLE users ADD COLUMN initiation_semester TEXT CHECK(initiation_semester IN ('Spring', 'Fall'));
  ```
- [ ] 2.6 Create trigger to auto-compute real_name from components:
  ```sql
  CREATE TRIGGER update_real_name AFTER UPDATE ON users
  BEGIN
    UPDATE users SET real_name =
      COALESCE(NEW.first_name, '') || ' ' ||
      COALESCE(NEW.middle_name, '') || ' ' ||
      COALESCE(NEW.last_name, '')
    WHERE discord_id = NEW.discord_id;
  END;
  ```
- [ ] 2.7 Test migration on development database with sample data
- [ ] 2.8 Create rollback script in case of migration failure

## 3. Data Migration & Backfill
- [ ] 3.1 Create backfill script: `scripts/backfill_user_data.ts`
- [ ] 3.2 Parse existing real_name into components:
  - [ ] Split on spaces: "John Michael Smith" → first="John", middle="Michael", last="Smith"
  - [ ] Handle edge cases: single name, hyphenated names, suffixes (Jr, Sr, III)
  - [ ] Log ambiguous cases for manual E-Board review
- [ ] 3.3 Map existing free-text industries to standardized list:
  - [ ] Create mapping: "Tech / Software Engineer" → "Technology / Software"
  - [ ] "Finance" → "Finance / Banking"
  - [ ] Unmapped values → "Other", log for E-Board categorization
- [ ] 3.4 Derive city from existing zip_code for US brothers (use existing zipToLocation logic)
- [ ] 3.5 Set country='United States' for all existing brothers (default assumption)
- [ ] 3.6 Run backfill script, generate report of manual cleanup needed
- [ ] 3.7 E-Board reviews and manually fixes ambiguous data

## 4. Validation Utilities
- [ ] 4.1 Create `src/lib/validation.ts` module
- [ ] 4.2 Implement validateChapter(input: string): boolean
  - [ ] Check input matches CHAPTERS constant (case-insensitive)
  - [ ] Return true if valid chapter, false otherwise
- [ ] 4.3 Implement validateYearSemester(input: string): {year: number, semester: string} | null
  - [ ] Regex: `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
  - [ ] Extract year (1931-2029) and semester
  - [ ] Return null if invalid format
- [ ] 4.4 Implement validatePhoneNumber(input: string): boolean
  - [ ] Regex: `/^[\d\s\(\)\-\+\.]+$/`
  - [ ] Require minimum 10 digits (strip non-digits to count)
  - [ ] Allow international formats: +1, +52, etc.
- [ ] 4.5 Implement validateZipOrCity(input: string): {type: 'zip'|'city', value: string}
  - [ ] If exactly 5 digits → type='zip'
  - [ ] Otherwise → type='city'
  - [ ] Return parsed type and sanitized value
- [ ] 4.6 Implement validateVoucherMentions(content: string, guildId: string): string[] | null
  - [ ] Parse Discord @mentions from text (format: <@USER_ID>)
  - [ ] Extract user IDs
  - [ ] Query database: check both users have status='BROTHER'
  - [ ] Return array of [voucher1_id, voucher2_id] if valid, null if invalid
  - [ ] Validate: must have exactly 2 mentions, must be different users
- [ ] 4.7 Write unit tests for all validation functions

## 5. Display Name System
- [ ] 5.1 Create `src/lib/displayNameBuilder.ts` utility
- [ ] 5.2 Implement getDisplayName(user: UserRow, format?: 'full'|'short'): string
  - [ ] If user.don_name exists:
    - [ ] format='full': "Don {don_name} ({first_name} {last_name})"
    - [ ] format='short': "Don {don_name}"
  - [ ] If no don_name:
    - [ ] format='full': "{first_name} {last_name}"
    - [ ] format='short': "{first_name}"
  - [ ] Fallback to real_name if name components missing
- [ ] 5.3 Implement getSelectMenuLabel(user: UserRow): string
  - [ ] Format for Discord select menus: "Don Phoenix • Tech" (don name + industry)
  - [ ] Or: "John Smith • Finance" (legal name if no don name)
  - [ ] Include industry/chapter as context
- [ ] 5.4 Write unit tests for display name logic

## 6. Multi-Step Verification Flow - Step 1: Chapter Selection
- [ ] 6.1 Update `src/commands/verify.ts`:
  - [ ] Update embed description: "This verification requires multiple steps. First, select your chapter."
  - [ ] Change button label: "Brother Verification" → "Start Verification"
- [ ] 6.2 Update `src/modules/access/accessHandler.ts` - handleAccessButton:
  - [ ] On 'verify_brother_start' button click:
  - [ ] Create StringSelectMenu with CHAPTERS constant (filter hidden=false)
  - [ ] customId: 'verify_select_chapter'
  - [ ] Placeholder: "Select your chapter"
  - [ ] Options: CHAPTERS array mapped to {label, value, description}
  - [ ] Send as ephemeral reply (only visible to user)

## 7. Multi-Step Verification Flow - Step 2: Industry Selection
- [ ] 7.1 Create handler for 'verify_select_chapter' interaction
- [ ] 7.2 Store selected chapter in interaction state (use customId encoding or database temp table)
- [ ] 7.3 Create StringSelectMenu with INDUSTRIES constant
  - [ ] customId: 'verify_select_industry_{chapter}'
  - [ ] Placeholder: "Select your primary industry"
  - [ ] Options: INDUSTRIES array (50 items)
- [ ] 7.4 Update previous message to show selected chapter
- [ ] 7.5 Send industry select menu as new ephemeral message

## 8. Multi-Step Verification Flow - Step 3: Modal with Remaining Fields
- [ ] 8.1 Create handler for 'verify_select_industry' interaction
- [ ] 8.2 Extract chapter and industry from interaction state
- [ ] 8.3 Build modal with fields:
  - [ ] First Name (required, short text)
  - [ ] Middle Name (optional, short text)
  - [ ] Last Name (required, short text)
  - [ ] Don Name (optional, short text, placeholder: "e.g., Phoenix")
    - [ ] Helper text in label: "Don Name (your brother name - exclude 'Don')"
  - [ ] Year & Semester (required, short text, placeholder: "2010 Spring")
  - [ ] Voucher @Mentions (required, short text, placeholder: "@Brother1 @Brother2")
    - [ ] Helper text: "Mention 2 ΓΠ brothers who can vouch for you"
  - [ ] Phone Number (required, short text, placeholder: "(555) 123-4567")
  - [ ] Zip Code or City (required, short text, placeholder: "12345 or Toronto, Canada")
  - [ ] Job Title (required, short text, placeholder: "Software Engineer")
- [ ] 8.4 Set modal customId: 'verify_final_modal_{chapter}_{industry}'
- [ ] 8.5 Show modal to user

## 9. Modal Submission & Validation
- [ ] 9.1 Create handler for 'verify_final_modal' submission in handleAccessModal
- [ ] 9.2 Extract all field values from modal
- [ ] 9.3 Parse chapter and industry from customId
- [ ] 9.4 Run validation pipeline:
  - [ ] Validate year/semester format using validateYearSemester()
  - [ ] Validate voucher @mentions using validateVoucherMentions()
    - [ ] Must have exactly 2 mentions
    - [ ] Both must be existing brothers (status='BROTHER')
    - [ ] Must be different users
  - [ ] Validate phone number using validatePhoneNumber()
  - [ ] Validate zip/city using validateZipOrCity()
- [ ] 9.5 If validation fails:
  - [ ] Reply with error message explaining issue
  - [ ] Allow user to click "Try Again" button to restart flow
- [ ] 9.6 If validation succeeds, proceed to data storage

## 10. Data Storage & Ticket Creation
- [ ] 10.1 Parse year/semester from validated input
- [ ] 10.2 Determine location handling:
  - [ ] If zip (5 digits): derive city, state, timezone using zipToLocation utility
  - [ ] If city (other): store as-is, prompt for country if not "United States"
- [ ] 10.3 Extract voucher Discord IDs from @mentions
- [ ] 10.4 Update userRepository.upsert() to handle new fields:
  ```typescript
  upsert({
    discord_id: userId,
    first_name, middle_name, last_name,
    don_name, phone_number,
    chapter, initiation_year, initiation_semester,
    industry, job_title,
    zip_code, city, state_province, country
  })
  ```
- [ ] 10.5 Create verification ticket in ticketRepository with both vouchers:
  ```typescript
  create(ticketId, userId, {
    voucher_1: voucherIds[0],
    voucher_2: voucherIds[1]
  })
  ```
- [ ] 10.6 Reply to user: "Application submitted! Ticket ID: {ticketId}. Waiting for vouchers to approve."

## 11. Verification Ticket Embed Enhancement
- [ ] 11.1 Update verification ticket embed sent to VERIFICATION_CHANNEL_ID:
  - [ ] Title: "New Verification Request"
  - [ ] Fields:
    - [ ] User: <@{userId}>
    - [ ] Name: {first_name} {middle_name} {last_name}
    - [ ] Don Name: {don_name} (or "Not provided")
    - [ ] Chapter: {chapter}
    - [ ] Initiation: {year} {semester}
    - [ ] Vouchers: <@{voucher1}> and <@{voucher2}>
    - [ ] Industry: {industry}
    - [ ] Job Title: {job_title}
    - [ ] Location: {city}, {state} (or {zip_code})
    - [ ] Phone: {phone_number}
  - [ ] Footer: "Vouchers will be notified to approve"
- [ ] 11.2 Send DM to both vouchers:
  - [ ] "You've been listed as a voucher for <@{userId}> ({first_name} {last_name}, {chapter} {year})"
  - [ ] "Please approve in #{verification_channel} if you recognize this brother"

## 12. Voucher Approval Flow Updates
- [ ] 12.1 Update approval button handler to validate voucher identity:
  - [ ] Check if clicker is voucher_1 or voucher_2 (from ticket)
  - [ ] If match: approve automatically (no second brother needed)
  - [ ] If non-voucher clicks: ignore or show "Only listed vouchers can approve"
- [ ] 12.2 Update approval logic:
  - [ ] If voucher_1 clicks: mark voucher_1 as approved, status = '1/2'
  - [ ] If voucher_2 clicks: mark voucher_2 as approved
  - [ ] If both approved: status = 'VERIFIED', assign Brother role
- [ ] 12.3 Update approval messages to reflect voucher-based system

## 13. E-Board Omega Chapter Assignment
- [ ] 13.1 Create new command: `/chapter-assign`
  - [ ] Permission: E-Board only
  - [ ] Parameters: user (required), chapter (dropdown including Omega)
  - [ ] Description: "Assign a brother to a specific chapter (including Omega)"
- [ ] 13.2 Implement command handler:
  - [ ] Validate user exists and is Brother status
  - [ ] Update user.chapter to selected value (including Omega)
  - [ ] Log action: "{admin} assigned {user} to {chapter}"
  - [ ] Reply: "✅ {user} chapter updated to {chapter}"
- [ ] 13.3 Add Omega chapter to CHAPTERS constant with hidden=true:
  ```typescript
  { value: 'omega', label: 'Omega - [Special Designation]', hidden: true }
  ```

## 14. Profile Display Updates
- [ ] 14.1 Update `/find` command to use getDisplayName():
  - [ ] Results show: "Don Phoenix • Tech • NYC" instead of "John Smith"
- [ ] 14.2 Update `/attendance` command to use don names in roll call
- [ ] 14.3 Update `/vote` command to show don names in voter list
- [ ] 14.4 Update all userRepository queries that display names to use displayNameBuilder

## 15. Profile Update Command (For Existing Brothers)
- [ ] 15.1 Create new command: `/profile-update`
  - [ ] Description: "Update your profile information (don name, phone, etc.)"
  - [ ] Opens modal with optional fields: don_name, phone_number
- [ ] 15.2 Send DM to existing brothers (one-time migration prompt):
  - [ ] "We've upgraded our profiles! Please add your don name and phone: `/profile-update`"
  - [ ] Track who has responded, gentle reminder after 1 week

## 16. Integration & Testing
- [ ] 16.1 Test multi-step flow end-to-end:
  - [ ] Select chapter → select industry → fill modal → submit
  - [ ] Verify all fields saved correctly in database
- [ ] 16.2 Test validation error handling:
  - [ ] Invalid year format ("2010" without semester)
  - [ ] Invalid voucher (@mentions non-brother or only 1 mention)
  - [ ] Invalid phone (letters, too short)
  - [ ] Invalid zip (international format like "M5V 3A8")
- [ ] 16.3 Test display name system:
  - [ ] Brother with don_name shows correctly in `/find`
  - [ ] Brother without don_name falls back to legal name
- [ ] 16.4 Test E-Board Omega assignment:
  - [ ] Omega not visible in public chapter dropdown
  - [ ] E-Board can assign Omega via `/chapter-assign`
- [ ] 16.5 Test international address handling:
  - [ ] Enter city "Toronto" → prompts for country (or defaults to US)
  - [ ] Enter 5-digit zip → auto-derives US city/state
- [ ] 16.6 Test voucher approval with new system:
  - [ ] Only listed vouchers can approve
  - [ ] Both vouchers must approve before role assignment

## 17. Documentation
- [ ] 17.1 Update CLAUDE.md:
  - [ ] Document new verification flow (multi-step)
  - [ ] Explain chapter/industry constants
  - [ ] Note Omega special handling
- [ ] 17.2 Update GEMINI.md with same info
- [ ] 17.3 Update Tech Chair Runbook:
  - [ ] Chapter list update process (quarterly check of phiota.org)
  - [ ] How to add new industries if requested
  - [ ] Omega chapter assignment workflow
  - [ ] Data migration troubleshooting
- [ ] 17.4 Update FiotaBot_Implementation_SOP.md:
  - [ ] New database schema
  - [ ] Verification flow diagram
- [ ] 17.5 Create user-facing guide:
  - [ ] "How to Verify as a Brother" with screenshots of multi-step flow
  - [ ] "How to Update Your Profile" for existing brothers
- [ ] 17.6 Document industry standardization mapping (old → new values)
