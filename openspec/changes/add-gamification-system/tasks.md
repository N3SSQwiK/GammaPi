# Implementation Tasks: Gamification & Recognition System

## 1. Database Schema
- [ ] 1.1 Create `achievements` table (id, name, description, unlock_criteria, badge_role_id)
- [ ] 1.2 Create `user_achievements` table (user_id, achievement_id, unlocked_at, notified)
- [ ] 1.3 Create `wins` table (id, user_id, win_type, title, description, posted_at, reaction_count)
- [ ] 1.4 Create AchievementRepository with unlock detection and notification methods

## 2. Achievement Badge System
- [ ] 2.1 Define 10+ achievement types with unlock criteria
  - [ ] "Networker" - First `/find` usage
  - [ ] "Pillar of Attendance" - 5 meetings attended
  - [ ] "Maestro" - Toggled `/mentor on`
  - [ ] "Content Creator" - Posted in `lions-den`
  - [ ] "Career Catalyst" - Posted job in `career-center`
  - [ ] "Historia Scholar" - 10 quiz questions correct
  - [ ] "Spotlight Star" - Completed brother spotlight
  - [ ] "Industry Expert" - 5 Industry Pulse responses
  - [ ] "Founding Member" - Verified in first 30 days
  - [ ] "Ambassador" - Vouched for 3 new brothers
- [ ] 2.2 Add achievement badge roles to serverConfig.ts
- [ ] 2.3 Implement event listeners for achievement triggers
- [ ] 2.4 Create badge unlock notification system (DM + public announcement)
- [ ] 2.5 Build `/achievements` command to view earned and available badges

## 3. Wins Channel System
- [ ] 3.1 Create `/wins` slash command with type selection (promotion, degree, certification, award, other)
- [ ] 3.2 Build interactive form for win details (title, company/school, description)
- [ ] 3.3 Implement auto-formatted embed generation with confetti emoji and colors
- [ ] 3.4 Add wins posting to designated channel with role mentions
- [ ] 3.5 Track reaction counts in `wins` table for engagement metrics

## 4. Quarterly Wins Roundup
- [ ] 4.1 Create n8n workflow for quarterly compilation (runs first Monday of Jan, Apr, Jul, Oct)
- [ ] 4.2 Query all wins from previous quarter grouped by type
- [ ] 4.3 Generate formatted summary with statistics (X promotions, Y degrees, etc.)
- [ ] 4.4 Post roundup to `#announcements` and `#professional-networking`
- [ ] 4.5 Export shareable graphic/text for LinkedIn posting

## 5. Integration & Testing
- [ ] 5.1 Test achievement unlock detection for all 10+ badge types
- [ ] 5.2 Verify badge role assignment and notification delivery
- [ ] 5.3 Test wins submission flow end-to-end
- [ ] 5.4 Validate quarterly roundup generation with mock data
- [ ] 5.5 Run `/setup` to create achievement badge roles in test server

## 6. Documentation
- [ ] 6.1 Document achievement unlock criteria in user guide
- [ ] 6.2 Create wins submission best practices guide
- [ ] 6.3 Update CLAUDE.md and GEMINI.md with gamification features
- [ ] 6.4 Add achievement tracking to Tech Chair Runbook
