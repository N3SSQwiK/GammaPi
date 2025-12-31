# Implementation Tasks: Enhanced Verification UX

## 1. Data Preparation & Constants
- [x] 1.1 Manually extract chapter list from phiota.org/chapters
- [x] 1.2 Create CHAPTERS constant in `src/lib/constants.ts`:
  - [x] Format: `{ value: 'gamma-pi', label: 'Gamma Pi - Graduate Chapter', hidden: false }`
  - [x] Include all active undergraduate, graduate, and alumni chapters
  - [x] Add Omega chapter with `hidden: true` flag
  - [x] Sort alphabetically by Greek letter
- [x] 1.3 Create INDUSTRIES constant with 50 NAICS-based categories:
  - [x] Tech/Software, Finance/Banking, Healthcare/Medical, Legal, Education, Government, etc.
  - [x] Include "Other (please specify in notes)" as final option
  - [x] Map old industry free-text to new standardized values for migration
- [ ] 1.4 Document chapter list update process in Tech Chair Runbook

## 2. Database Schema Migration
- [x] 2.1 Create migration script: `migrations/001_enhance_user_schema.sql` (implemented inline in db.ts)
- [x] 2.2 Add name fields:
  ```sql
  ALTER TABLE users ADD COLUMN first_name TEXT;
  -- middle_name removed per user request
  ALTER TABLE users ADD COLUMN last_name TEXT;
  ALTER TABLE users ADD COLUMN don_name TEXT;
  ```
- [x] 2.3 Add contact fields:
  ```sql
  ALTER TABLE users ADD COLUMN phone_number TEXT;
  ```
- [x] 2.4 Add location fields:
  ```sql
  ALTER TABLE users ADD COLUMN city TEXT;
  ALTER TABLE users ADD COLUMN state_province TEXT;
  ALTER TABLE users ADD COLUMN country TEXT DEFAULT 'United States';
  ```
- [x] 2.5 Add verification metadata fields:
  ```sql
  ALTER TABLE users ADD COLUMN chapter TEXT;
  ALTER TABLE users ADD COLUMN initiation_year INTEGER;
  ALTER TABLE users ADD COLUMN initiation_semester TEXT CHECK(initiation_semester IN ('Spring', 'Fall'));
  ```
- [x] 2.6 ~~Create trigger to auto-compute real_name~~ DEPRECATED: real_name deprecated in favor of first_name + last_name
- [x] 2.7 Test migration on development database with sample data
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
- [x] 4.1 Create `src/lib/validation.ts` module
- [x] 4.2 Implement validateChapter(input: string): boolean (via isValidChapter in constants.ts)
  - [x] Check input matches CHAPTERS constant (case-insensitive)
  - [x] Return true if valid chapter, false otherwise
- [x] 4.3 Implement validateYearSemester(input: string): {year: number, semester: string} | null
  - [x] Regex: `/^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i`
  - [x] Extract year (1931-2029) and semester
  - [x] Return null if invalid format
- [x] 4.4 Implement validatePhoneNumber(input: string): boolean
  - [x] Regex: `/^[\d\s\(\)\-\+\.]+$/`
  - [x] Require minimum 10 digits (strip non-digits to count)
  - [x] Allow international formats: +1, +52, etc.
- [x] 4.5 Implement validateZipOrCity(input: string): {type: 'zip'|'city', value: string}
  - [x] If exactly 5 digits → type='zip'
  - [x] Otherwise → type='city'
  - [x] Return parsed type and sanitized value
- [x] 4.6 Implement voucher search by name (parseVoucherSearch, calculateNameMatchScore)
  - [x] Changed from @mentions to name-based search per user request
  - [x] Search brothers by don_name, first_name, last_name with fuzzy matching
  - [x] Return matching brothers for user selection
- [ ] 4.7 Write unit tests for all validation functions

## 5. Display Name System
- [x] 5.1 Create `src/lib/displayNameBuilder.ts` utility
- [x] 5.2 Implement getDisplayName(user: UserRow, format?: 'full'|'short'): string
  - [x] If user.don_name exists:
    - [x] format='full': "Don {don_name} ({first_name} {last_name})"
    - [x] format='short': "Don {don_name}"
  - [x] If no don_name:
    - [x] format='full': "{first_name} {last_name}"
    - [x] format='short': "{first_name}"
  - [x] Fallback to first_name + last_name if don_name missing
- [x] 5.3 Implement getSelectMenuLabel(user: UserRow): string
  - [x] Format for Discord select menus: "Don Phoenix • Tech" (don name + industry)
  - [x] Or: "John Smith • Finance" (legal name if no don name)
  - [x] Include industry/chapter as context
- [ ] 5.4 Write unit tests for display name logic

## 6. Multi-Step Verification Flow - Step 1: Chapter Selection
- [x] 6.1 Update `src/commands/verify.ts`:
  - [x] Update embed description to explain `/verify-start` flow
  - [x] Button still available for legacy/guest access
- [x] 6.2 Created `/verify-start` command with autocomplete:
  - [x] Slash command with chapter and industry autocomplete options
  - [x] Autocomplete searches CHAPTERS and INDUSTRIES constants
  - [x] After validation, shows Modal 1 for identity info
  - [x] Send as ephemeral reply (only visible to user)

## 7. Multi-Step Verification Flow - Step 2: Industry Selection
- [x] 7.1 Industry selection combined with chapter in /verify-start command
- [x] 7.2 Store selected chapter/industry in pendingVerifications Map
- [x] 7.3 Industry provided via autocomplete (supports 50+ items)
  - [x] Autocomplete dynamically searches INDUSTRIES constant
  - [x] Returns top 25 matches per Discord limit
- [x] 7.4 Chapter and industry validated before showing Modal 1
- [x] 7.5 State stored in-memory until modal completion

## 8. Multi-Step Verification Flow - Step 3: Modal with Remaining Fields
- [x] 8.1 Created two-modal flow (Discord limits modals to 5 fields each)
- [x] 8.2 Chapter and industry from /verify-start stored in pendingVerifications
- [x] 8.3 Modal 1 (verify_modal_1) fields:
  - [x] First Name (required)
  - [x] Last Name (required)
  - [x] Don Name (optional, placeholder: "Phoenix - without 'Don' prefix")
  - [x] Year & Semester (required, placeholder: "2015 Spring")
  - [x] Job Title (required)
- [x] 8.4 Modal 1 submission shows "Continue to Step 2" button
- [x] 8.5 Modal 2 (verify_modal_2) fields:
  - [x] Phone Number (required)
  - [x] City (required)
  - [x] Voucher 1 Name (required, placeholder: "Don Phoenix or John Smith")
  - [x] Voucher 2 Name (required, placeholder: "Don Eagle or Jane Doe")
- [x] 8.6 Two-modal approach because Discord doesn't allow chaining modals directly

## 9. Modal Submission & Validation
- [x] 9.1 Created handleVerificationModals() for verify_modal_1 and verify_modal_2
- [x] 9.2 Extract field values from both modals, combine with stored state
- [x] 9.3 Chapter and industry retrieved from pendingVerifications Map
- [x] 9.4 Validation pipeline:
  - [x] Validate year/semester format using validateYearSemester()
  - [x] Validate voucher names using searchBrothersByName()
    - [x] Name-based search (not @mentions) per user request
    - [x] Both must be existing brothers (status='BROTHER')
    - [x] Fuzzy matching on don_name, first_name, last_name
  - [x] Validate phone number using validatePhoneNumber()
  - [x] Validate city (simple text field)
- [x] 9.5 If validation fails:
  - [x] Reply with error message explaining issue
  - [x] User can run /verify-start again
- [x] 9.6 If validation succeeds, proceed to data storage and ticket creation

## 10. Data Storage & Ticket Creation
- [x] 10.1 Parse year/semester from validated input
- [x] 10.2 City stored directly (simplified from zip-based approach)
- [x] 10.3 Voucher names stored directly (searched by name, not Discord ID)
- [x] 10.4 Updated userRepository.upsert() with new fields:
  - [x] first_name, last_name, don_name, phone_number
  - [x] chapter, initiation_year, initiation_semester
  - [x] industry, job_title, city
- [x] 10.5 Create verification ticket with named vouchers:
  ```typescript
  create(ticketId, userId, namedVoucher1, namedVoucher2)
  ```
- [x] 10.6 Reply to user with ticket ID and waiting message

## 11. Verification Ticket Embed Enhancement
- [x] 11.1 Updated verification ticket embed sent to VERIFICATION_CHANNEL_ID:
  - [x] Title: "🦁 New Verification Request"
  - [x] Fields:
    - [x] User: Discord mention
    - [x] Name: first_name last_name (with don_name if set)
    - [x] Chapter: chapter name
    - [x] Initiation: year semester
    - [x] Named Vouchers: voucher names (searched, not @mentions)
    - [x] Industry: industry
    - [x] Job Title: job_title
    - [x] Location: city
    - [x] Phone: phone_number
  - [x] Footer: "Vouchers may take up to 48 hours. After 48hrs, any brother can approve."
- [ ] 11.2 Send DM to vouchers (future enhancement - requires finding Discord ID from name)

## 12. Voucher Approval Flow Updates
- [x] 12.1 Updated approval button handler with 48hr fallback:
  - [x] Named vouchers stored as text, not Discord IDs
  - [x] Within 48hrs: any brother can approve (name-based matching)
  - [x] After 48hrs: any brother can approve (fallback per user request)
  - [x] E-Board can use /verify-override for immediate approval
- [x] 12.2 Updated approval logic in ticketRepository.canApprove():
  - [x] Check created_at timestamp for 48hr window
  - [x] Record approvals with voucher_1_id, voucher_2_id, timestamps
  - [x] If both approved: status = 'VERIFIED', assign Brother role
- [x] 12.3 Updated approval messages with brother names and approval count

## 13. E-Board Omega Chapter Assignment
- [x] 13.1 Created `/chapter-assign` command:
  - [x] Permission: Administrator only
  - [x] Parameters: user (required), chapter (autocomplete including Omega)
  - [x] Description: "E-Board: Assign a brother to a specific chapter (including Omega)"
- [x] 13.2 Implemented command handler:
  - [x] Validate user exists and is Brother status
  - [x] Update user.chapter using userRepository.updateChapter()
  - [x] Log action: "[Access] Chapter assigned: {admin} assigned {user} to {chapter}"
  - [x] Reply: "✅ {user}'s chapter has been updated to {chapter}"
- [x] 13.3 Omega chapter in CHAPTERS constant with hidden=true:
  - [x] Hidden from public autocomplete in /verify-start
  - [x] Visible in /chapter-assign autocomplete for E-Board

## 14. Profile Display Updates
- [x] 14.1 Updated `/find` command to use getDisplayName():
  - [x] Results show: "Don Phoenix • Tech • NYC" format
  - [x] Fallback to first_name last_name if no don_name
- [ ] 14.2 Update `/attendance` command to use don names in roll call
- [ ] 14.3 Update `/vote` command to show don names in voter list
- [x] 14.4 Core display name builder utility created for all name displays

## 15. Profile Update Command (For Existing Brothers)
- [x] 15.1 Created `/profile-update` command:
  - [x] Description: "Update your profile information (don name, phone, etc.)"
  - [x] Opens modal with optional fields: don_name, phone_number, job_title, city
  - [x] Pre-fills current values from database
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
- [x] 17.1 Update CLAUDE.md:
  - [x] Document new verification flow (multi-step)
  - [x] Explain chapter/industry constants
  - [x] Note Omega special handling
  - [x] Document new commands (/verify-start, /verify-override, /chapter-assign, /profile-update)
  - [x] Update database schema documentation
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
