# LinkedIn Integration Bridge - Design Document

## Context

Gamma Pi is a graduate/professional chapter where LinkedIn is the primary professional platform. The original Discord Migration Report (section 4.1) identified LinkedIn integration as critical for bridging the gap between where brothers are active (LinkedIn) and where chapter community lives (Discord). This design outlines technical decisions for bidirectional LinkedIn↔Discord flow while navigating LinkedIn API constraints.

**Key Constraints:**
- LinkedIn API access requires Developer Application approval (not guaranteed)
- Free tier rate limits: 500 requests/day
- Company page access requires admin permissions on Gamma Pi LinkedIn
- OAuth flow requires HTTPS domain (Hostinger VPS with SSL)
- Brother privacy concerns about LinkedIn data access

## Goals / Non-Goals

**Goals:**
- Automatically celebrate brother career milestones detected from LinkedIn
- Amplify Gamma Pi LinkedIn content in Discord for brother engagement
- Leverage LinkedIn trending data for timely Industry Pulse discussions
- Optional: Use LinkedIn OAuth for guest verification (combat spam/bots)
- Design for graceful degradation (manual workflows when API unavailable)

**Non-Goals:**
- Posting to brothers' personal LinkedIn profiles (privacy violation)
- Scraping LinkedIn without API (ToS violation, unreliable)
- Real-time synchronization (batch processing acceptable given rate limits)
- LinkedIn messaging integration (out of scope)

## Decisions

### Decision 1: n8n for LinkedIn API Orchestration
**Choice:** Use n8n workflows for LinkedIn API polling rather than embedding in FiotaBot
**Rationale:**
- n8n natively supports LinkedIn API nodes (OAuth handling built-in)
- Separates concerns: FiotaBot for Discord logic, n8n for external integrations
- Easy rate limit management with n8n's scheduling and error handling
- Non-technical E-Board members can troubleshoot n8n visual workflows

**Alternatives considered:**
- Embed LinkedIn API client in FiotaBot TypeScript → Increases bot complexity, harder rate limit management
- Use Zapier → Paid tier required for LinkedIn API, n8n is self-hosted and free

### Decision 2: Phased Implementation with Manual Fallbacks
**Choice:** Design all features with manual workflow alternatives
**Rationale:**
- LinkedIn API approval not guaranteed (developer applications can be rejected)
- Rate limits may be insufficient for large chapter (>100 brothers × daily checks = API strain)
- Ensures features deliver value even without automation
- Allows incremental rollout: manual → semi-automated → fully automated

**Phase Progression:**
1. **Phase 0 (No API):** Manual LinkedIn URL collection, E-Board posts amplifications
2. **Phase 1 (OAuth Only):** Guest verification via LinkedIn Sign-In
3. **Phase 2 (Read API):** Profile monitoring for career milestones
4. **Phase 3 (Company API):** Gamma Pi page post cross-posting
5. **Phase 4 (Full Automation):** Trending topics, engagement tracking

### Decision 3: Daily Profile Monitoring (Not Real-Time)
**Choice:** Check LinkedIn profiles once daily at 8am, not real-time
**Rationale:**
- Rate limits prohibit frequent polling (100 brothers × 24 hourly checks = 2,400 requests/day, exceeds 500 limit)
- Career changes are not time-sensitive (celebrating within 24 hours is acceptable)
- Batch processing allows efficient caching and deduplication

**Trade-off:** Slight delay in milestone detection vs. sustainable API usage

### Decision 4: Confidence Scoring for Milestone Detection
**Choice:** Apply ML-like heuristics to classify profile changes, only post high/medium confidence
**Rationale:**
- LinkedIn profiles frequently edited without actual career change (typo fixes, wording changes)
- False positives damage credibility ("Congrats on your new job!" when it's just a title edit)
- Heuristics: company change + title change = high confidence, same company title change = medium

**Rules:**
- **High:** Company changed + title changed (definitely new job)
- **Medium:** Same company, title contains "Senior/Lead/Principal/Manager" (likely promotion)
- **Low:** Title edited but semantically same (e.g., "Software Engineer" → "Software Developer")

**Low confidence logged for E-Board manual review, not auto-posted**

### Decision 5: LinkedIn OAuth for Guest Verification (Optional Enhancement)
**Choice:** Implement LinkedIn OAuth verification as opt-in alternative to brother vouching
**Rationale:**
- Original Migration Report (section 5.2) proposed LinkedIn OAuth to combat spam/bots
- Validates real professional (account age, connections, profile completeness)
- Lower friction than requiring 2 brothers to vouch for unknown guest

**Privacy Design:**
- Only request r_liteprofile (basic info, no employment history)
- Store minimal data: name, email, profile URL
- Clear privacy notice: "We verify you're real, not a bot. We don't access your posts or connections."
- Allow revocation: `/linkedin unlink` deletes all stored LinkedIn data

**Alternative:** Guest verification remains brother-vouching only (simpler, no API dependency)

## Risks / Trade-offs

### Risk 1: LinkedIn API Access Denial
**Impact:** All automation features require fallback to manual workflows
**Mitigation:**
- Design manual workflows first (ensure feature value without API)
- Phase 0 implementation ready on day 1
- Appeal denial with clear use case: "Educational fraternity, non-commercial, enhancing professional development"

**Likelihood:** Medium (LinkedIn favors commercial applications, but educational orgs often approved)

### Risk 2: Rate Limit Exhaustion
**Impact:** Features may be throttled or disabled during high activity periods
**Mitigation:**
- Implement request queuing and prioritization (milestones > trending topics)
- Alert E-Board when approaching limit (450/500 requests)
- Daily quota reset automation (resume features at midnight)
- Upgrade to paid tier if chapter deems valuable (LinkedIn Marketing Developer Platform)

**Likelihood:** High if chapter >75 brothers with linked profiles

### Risk 3: Brother Privacy Concerns
**Impact:** Low adoption of LinkedIn profile linking if brothers distrust data usage
**Mitigation:**
- Transparent privacy policy in `/linkedin link` command
- Minimal data access (only public profile data)
- Clear opt-out: linking is optional, manual `/wins` always available
- E-Board endorsement: "We're brothers - we only celebrate your success, never spam"

**Likelihood:** Low (brothers already share location, industry in verification)

### Trade-off 1: Accuracy vs. Automation
**Choice:** Prioritize accuracy (confidence scoring) over speed (real-time detection)
**Consequence:** Some milestones may be missed if classified as low confidence
**Justification:** False positive celebrations damage trust; missed celebration can be manually posted

### Trade-off 2: Feature Richness vs. Simplicity
**Choice:** Implement phased rollout (OAuth first, then monitoring, then trending)
**Consequence:** Delayed gratification - full vision takes months to realize
**Justification:** Each phase delivers standalone value; avoids big-bang failure risk

## Migration Plan

### Step 1: LinkedIn Developer Application (Week 0)
- E-Board Tech Chair submits LinkedIn Developer Application
- Request API products: Sign In with LinkedIn, Marketing Developer Platform (if budget allows)
- Prepare application justification: "Educational fraternity, 501(c)(7), professional development"

### Step 2: Phase 0 - Manual Workflows (Week 1)
- Add LinkedIn URL field to verification form (optional)
- Store URLs in `linkedin_profiles` table
- E-Board manually monitors Gamma Pi LinkedIn, posts links to Discord
- Brothers manually use `/wins` for career milestones
- **Success metric:** >50% brothers provide LinkedIn URL

### Step 3: Phase 1 - OAuth Guest Verification (Week 2-3, if API approved)
- Implement LinkedIn OAuth flow in FiotaBot
- Add "Sign in with LinkedIn" button in welcome gate
- Validate profile quality (age, connections, photo)
- Grant Guest role on successful verification
- **Success metric:** >70% guests choose LinkedIn OAuth over manual vouching

### Step 4: Phase 2 - Profile Monitoring (Week 4-6)
- Create n8n workflow for daily profile checks (8am)
- Implement milestone detection with confidence scoring
- Auto-post high/medium confidence milestones to wins channel
- Log low confidence for E-Board review
- **Success metric:** >80% milestones detected within 24 hours, <10% false positives

### Step 5: Phase 3 - Company Page Amplification (Week 7-8)
- Configure Gamma Pi LinkedIn company page API access
- Create n8n workflow for hourly page monitoring
- Auto-cross-post new LinkedIn content to Discord
- Track amplification engagement (if API provides insights)
- **Success metric:** >50% brothers click amplification links, >20% engage on LinkedIn

### Step 6: Phase 4 - Trending Topics Integration (Week 9-10)
- Implement weekly trending hashtag fetching
- Generate Industry Pulse posts from LinkedIn trends
- Match trends to brother industries, auto-tag relevant members
- **Success metric:** Trending-based Industry Pulse drives >30% more engagement than manual topics

### Rollback Plan
- **If API denied:** Remain in Phase 0 (manual workflows) indefinitely
- **If rate limits hit:** Pause automation, extend polling intervals (daily → weekly)
- **If brothers opt-out:** LinkedIn URL field remains optional, no pressure to link

## Open Questions

1. **LinkedIn Company Page Admin Access:** Do we currently have admin access to Gamma Pi LinkedIn page? (Required for amplification)
   - **Action:** E-Board to verify with National or request admin role

2. **Email Service for Digest:** Should LinkedIn milestone celebrations also appear in weekly Pulse digest?
   - **Recommendation:** Yes - include in "Brotherhood Wins" section of digest

3. **Paid LinkedIn API Tier:** If rate limits are hit, is chapter willing to fund Marketing Developer Platform (~$150-300/month)?
   - **Decision:** Defer to E-Board budget discussion; design assumes free tier

4. **LinkedIn OAuth for Brothers:** Should existing brothers re-link via OAuth (vs. just URL)?
   - **Recommendation:** Optional; OAuth provides token for API access, URL-only is passive

5. **Trending Topics Granularity:** Should we fetch trends globally or by geographic region?
   - **Decision:** Start globally (simpler), add geo-filtering if data shows regional variance

## Success Criteria

**Phase 0 (Manual):**
- >50% brothers provide LinkedIn URL in verification

**Phase 1 (OAuth):**
- >70% guests use LinkedIn OAuth verification
- <5% OAuth failures or errors

**Phase 2 (Milestones):**
- >80% career changes detected within 24 hours
- <10% false positive rate (manual E-Board review as ground truth)

**Phase 3 (Amplification):**
- >50% brothers click LinkedIn amplification links
- >20% brothers engage on LinkedIn after Discord CTA
- Average 24-hour engagement lift >30% on amplified posts

**Phase 4 (Trending):**
- LinkedIn-sourced Industry Pulse posts drive >30% more replies than manual topics
- >60% brothers report trending topics as "relevant to my work"

## Monitoring & Maintenance

- **Daily:** Check n8n workflow execution logs for LinkedIn API errors
- **Weekly:** Review low-confidence milestone queue (E-Board approves/rejects)
- **Monthly:** Analyze rate limit usage trend (project when upgrade needed)
- **Quarterly:** Survey brothers on LinkedIn bridge value (NPS score)
