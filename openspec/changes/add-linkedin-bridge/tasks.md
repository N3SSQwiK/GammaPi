# Implementation Tasks: LinkedIn Integration Bridge

## 1. LinkedIn API Setup (External)
- [ ] 1.1 Create LinkedIn Developer Application at https://www.linkedin.com/developers/
- [ ] 1.2 Request API access permissions:
  - [ ] r_liteprofile (read profile data)
  - [ ] r_emailaddress (for OAuth verification)
  - [ ] w_member_social (post on behalf of members - requires approval)
  - [ ] r_organization_social (read company page posts)
- [ ] 1.3 Obtain Client ID and Client Secret credentials
- [ ] 1.4 Configure OAuth redirect URLs for Hostinger domain
- [ ] 1.5 Verify Gamma Pi LinkedIn page admin access
- [ ] 1.6 Document API rate limits (throttling strategy required)

## 2. Database Schema
- [ ] 2.1 Create `linkedin_profiles` table (user_id, linkedin_url, profile_data, last_checked)
- [ ] 2.2 Create `linkedin_milestones` table (id, user_id, milestone_type, title, company, detected_at, posted_to_discord)
- [ ] 2.3 Create `linkedin_amplification` table (post_id, url, posted_at, brother_engagements)
- [ ] 2.4 Create `linkedin_oauth_sessions` table (session_id, user_id, state, created_at, completed_at)

## 3. LinkedIn Client Library
- [ ] 3.1 Create `src/lib/linkedinClient.ts` with methods:
  - [ ] authenticateOAuth(code) - Exchange auth code for token
  - [ ] getProfile(userId) - Fetch profile data
  - [ ] getCompanyPosts(companyId) - Fetch Gamma Pi page posts
  - [ ] getTrendingHashtags(industry) - Fetch trending topics (if API supports)
- [ ] 3.2 Implement token refresh logic (LinkedIn tokens expire)
- [ ] 3.3 Add rate limiting protection (500 requests/day for free tier)
- [ ] 3.4 Error handling for API failures and quota exhaustion

## 4. Career Milestone Detection
- [ ] 4.1 Create n8n workflow for profile monitoring (daily at 8am):
  - [ ] Poll LinkedIn API for each brother's profile
  - [ ] Compare current position/certifications to stored profile_data
  - [ ] Detect changes: new job title, company, certification
  - [ ] Record milestone in `linkedin_milestones` table
- [ ] 4.2 Implement milestone posting to Discord:
  - [ ] Format embed: "🎉 LinkedIn Update: @Brother is now [Title] at [Company]!"
  - [ ] Include LinkedIn post URL if available
  - [ ] Post to wins channel
  - [ ] Mark posted_to_discord=true
- [ ] 4.3 Add manual milestone submission fallback (for API downtime)

## 5. Chapter Content Amplification
- [ ] 5.1 Create n8n workflow for Gamma Pi LinkedIn page monitoring (hourly):
  - [ ] Fetch new posts from Gamma Pi company page
  - [ ] Filter for posts not yet shared to Discord
  - [ ] Record in `linkedin_amplification` table
- [ ] 5.2 Implement auto-cross-post to Discord:
  - [ ] Post to `#professional-networking` or `#announcements`
  - [ ] Format: "📣 New on LinkedIn: [Post excerpt]"
  - [ ] Include call-to-action: "Help amplify! Like/share on LinkedIn to boost visibility"
  - [ ] Add direct link to LinkedIn post
- [ ] 5.3 Track brother engagement:
  - [ ] Parse LinkedIn post insights (if API provides)
  - [ ] Record which brothers liked/shared (if trackable)
  - [ ] Award "Amplifier" achievement for 10 amplifications

## 6. Industry Trending Topics Integration
- [ ] 6.1 Create n8n workflow for trending hashtag fetching (weekly Sunday 8pm):
  - [ ] Query LinkedIn API for trending hashtags per industry
  - [ ] Match hashtags to brother industries from database
  - [ ] Select top 3 topics with most brother coverage
- [ ] 6.2 Generate Industry Pulse posts (reuses add-interactive-content feature)
  - [ ] Auto-generate discussion starters tied to trending topics
  - [ ] Tag brothers in matching industries
  - [ ] Include LinkedIn hashtag for context
- [ ] 6.3 Add fallback: manual trending topics seed list (if API unavailable)

## 7. LinkedIn OAuth Guest Verification (Optional Enhancement)
- [ ] 7.1 Implement OAuth flow for guest verification:
  - [ ] Add "Sign in with LinkedIn" button in welcome gate
  - [ ] Redirect to LinkedIn OAuth consent screen
  - [ ] Handle callback with auth code
  - [ ] Verify profile is real (account age, connections, photo)
- [ ] 7.2 Grant Guest or Candidate role based on profile validation
- [ ] 7.3 Store LinkedIn profile URL in user record for future reference
- [ ] 7.4 Document privacy policy (what data is stored/accessed)

## 8. Fallback Strategies (No API Access)
- [ ] 8.1 Manual milestone sharing: `/wins` command with LinkedIn import
- [ ] 8.2 Manual amplification: E-Board posts LinkedIn links with reminder
- [ ] 8.3 Manual trending topics: Weekly seed list from E-Board research
- [ ] 8.4 Document transition plan: manual → semi-automated → fully automated

## 9. Integration & Testing
- [ ] 9.1 Test OAuth flow end-to-end with test accounts
- [ ] 9.2 Verify profile monitoring with mock LinkedIn API responses
- [ ] 9.3 Test rate limiting protections (simulate quota exhaustion)
- [ ] 9.4 Validate milestone detection accuracy (promotion vs lateral move)
- [ ] 9.5 Test amplification workflow with real Gamma Pi LinkedIn post
- [ ] 9.6 Verify API token refresh logic (test with expired tokens)

## 10. Documentation & Compliance
- [ ] 10.1 Document LinkedIn API setup process for future tech chairs
- [ ] 10.2 Create privacy policy for LinkedIn data usage
- [ ] 10.3 Add LinkedIn integration troubleshooting to Tech Chair Runbook
- [ ] 10.4 Update CLAUDE.md and GEMINI.md with LinkedIn bridge features
- [ ] 10.5 Ensure compliance with LinkedIn API Terms of Service
