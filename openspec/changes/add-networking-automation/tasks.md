# Implementation Tasks: Networking Automation

## 1. Database Schema
- [ ] 1.1 Create `coffee_pairings` table (id, user1_id, user2_id, period, status, completed_at)
- [ ] 1.2 Create `geographic_clusters` table (id, region_name, channel_id, member_count)
- [ ] 1.3 Create `cluster_members` table (cluster_id, user_id, last_notified)
- [ ] 1.4 Create `roulette_preferences` table (user_id, opted_in, industry_preference, meeting_day_preference)
- [ ] 1.5 Create ConnectionsRepository with pairing and tracking methods

## 2. Office Hours Roulette System
- [ ] 2.1 Implement `/opt-in-roulette` command with preference form (opted in, preferred meeting days)
- [ ] 2.2 Build pairing algorithm with strategies:
  - [ ] Random pairs (default)
  - [ ] Complementary industries (different backgrounds)
  - [ ] Similar industries (deep domain discussions)
- [ ] 2.3 Create n8n workflow for monthly pairing (first Monday of month at 9am)
- [ ] 2.4 Implement pairing DM notification with:
  - [ ] Paired brother's name, industry, location, LinkedIn
  - [ ] Conversation starter suggestions
  - [ ] Scheduling helper: "Coordinate a 15min chat before month end!"
- [ ] 2.5 Create `/coffee-complete` command for brothers to mark chat completed
- [ ] 2.6 Send follow-up reminder 2 weeks after pairing if not completed

## 3. Geographic Clustering
- [ ] 3.1 Build proximity calculation using existing zip code data
- [ ] 3.2 Define geographic regions (Northeast, Southeast, Midwest, West, etc.)
- [ ] 3.3 Implement auto-clustering logic: when 3+ brothers within 50-mile radius
- [ ] 3.4 Create region-specific channels via serverConfig (optional, on-demand)
- [ ] 3.5 Build `/meetup suggest` command showing nearby brothers
- [ ] 3.6 Implement proximity notifications: "3 brothers in your area - plan a happy hour?"

## 4. Enhanced /find Integration
- [ ] 4.1 Add proximity filter to `/find` command: `/find location:Boston radius:25mi`
- [ ] 4.2 Show distance from user's location in search results
- [ ] 4.3 Add "Request Coffee Chat" button in `/find` results
- [ ] 4.4 Track connection requests in ConnectionsRepository

## 5. Connection Achievements
- [ ] 5.1 Define "Connector" achievement: Complete 5 Office Hours coffee chats
- [ ] 5.2 Define "Local Legend" achievement: Attend 3 geographic meetups (self-reported)
- [ ] 5.3 Implement achievement unlock triggers
- [ ] 5.4 Add `/meetup attended` command for brothers to log in-person meetup

## 6. Integration & Testing
- [ ] 6.1 Test pairing algorithm with mock data (random, complementary, similar industry)
- [ ] 6.2 Verify geographic clustering with real zip code data
- [ ] 6.3 Test DM notification flow for pairings
- [ ] 6.4 Validate proximity calculations for accuracy
- [ ] 6.5 Test completion tracking and reminder system

## 7. Documentation
- [ ] 7.1 Create Office Hours Roulette participation guide
- [ ] 7.2 Document pairing algorithm strategies
- [ ] 7.3 Add geographic clustering to user guide
- [ ] 7.4 Update CLAUDE.md and GEMINI.md with networking automation features
