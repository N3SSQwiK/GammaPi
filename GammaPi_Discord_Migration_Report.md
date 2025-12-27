# Gamma Pi (Phi Iota Alpha) Discord Migration & Engagement Strategy

**Date:** December 27, 2025
**Prepared For:** Gamma Pi Chapter (Graduate/Professional), Phi Iota Alpha Fraternity

## 1. Executive Summary
This report outlines the strategy to migrate Gamma Pi's operations, engagement, and management to a dedicated Discord server. As a **Graduate and Professional Chapter**, the focus shifts from traditional undergraduate "campus life" to **professional development, networking, and efficient chapter operations**. The goal is to centralize communication, enhance public visibility via **LinkedIn**, foster inter-chapter relations, and streamline internal business using automation (n8n) and custom application development.

## 2. Server Architecture & Permissions
To effectively manage different audiences (Public, Other Chapters, Internal), the server must use a strict **Role-Based Access Control (RBAC)** model.

### 2.1 Role Hierarchy (suggested)
*   **🦁 E-Board (Admin):** Full control, manages bots/webhooks.
*   **🦁 ΓΠ Brother:** Dues-paying members of Gamma Pi with full voting rights and internal business access.
*   **🦁 Visiting Brother (Active):** Verified active members from other chapters. Access to professional networking, but restricted from Gamma Pi chapter-specific business/voting.
*   **🦁 Brother at Large (Alumni):** Verified Phi Iota Alpha alumni or inactive brothers. Professional networking access.
*   **🦁 Line Committee:** Officers/Brothers responsible for the current intake. Elevated visibility into candidate data and debrief channels.
*   **👔 Candidate / Interest:** Professionals in the intake process. Limited access to public and specific onboarding channels.
*   **🌍 Guest / Public:** Read-only access to public announcements and social feeds.

### 2.2 Channel Categories & Visibility
We recommend utilizing Discord's "Categories" to group permissions.

| Category | Target Audience | Key Channels | Permissions |
| :--- | :--- | :--- | :--- |
| **📣 PUBLIC INFO** | Everyone | `#announcements`, `#events`, `#linkedin-feed`, `#about-us` | **Read:** Everyone<br>**Write:** E-Board only |
| **🤝 PROFESSIONAL NETWORKING** | All Brothers | `#industry-chat`, `#job-board`, `#resume-review`, `#mentorship` | **Read/Write:** All Brothers (Gamma Pi + Visiting)<br>**Deny:** Guests/Candidates |
| **🦁 CHAPTER OPS** | ΓΠ Brothers | `#general-chat`, `#meeting-minutes`, `#treasury`, `#service-projects` | **Read/Write:** ΓΠ Brothers only |
| **🗳️ E-BOARD** | Officers | `#officer-chat`, `#sensitive-matters`, `#intake-planning` | **Read/Write:** E-Board only |
| **📚 ONBOARDING** | Candidates + Bros | `#orientation`, `#candidate-resources` | **Read:** Candidates + Bros<br>**Write:** Bros |

## 3. Engagement Strategy

### 3.1 Public & Recruitment (Professional Focus)
*   **LinkedIn Integration:** The primary public face. Discord serves as the "engine room" where content is discussed before publishing.
*   **"Open House" Webinars:** Host professional development seminars (e.g., "Financial Literacy", "Leadership in Tech") in Discord Voice/Video channels, open to the public/candidates.

### 3.2 Internal Brotherhood
*   **"Pillar" Discussions:** Automated weekly prompts about fraternity history (using existing n8n data) to spark discussion.
*   **Professional Wins:** `#shoutouts` channel transformed into a "Wins" channel for job promotions, certifications, and degree completions.
*   **Geographic Connectivity:** Since we are a National Chapter, the bot automatically captures member Zip Codes to display their City/State and Timezone (e.g., "Brother Nexus (NYC - EST)"). This helps in planning region-specific meetups and respecting time zones for meetings.
*   **The Professional Rolodex:** We capture **Industry** and **Job Title** during verification. This allows brothers to run searches like `/find industry:Finance` to instantly connect with peers, rather than shouting into the void.
*   **Digital Office Hours:** Brothers can toggle a command `/mentor on` to signal they are open to mentorship. This lowers the barrier for younger members or candidates to reach out for advice.

### 3.3 Inter-Chapter
*   **Joint Networking:** Dedicated channels for planning joint professional mixers with other Graduate chapters.

## 4. Automation Strategy (n8n) & MS Office Integration
Leverage your existing n8n setup (hosted on Hostinger) to reduce manual administrative work and bridge the gap with National's MS Office ecosystem.

### 4.1 LinkedIn & Social Media Automation
*   **LinkedIn to Discord:** Watch the Chapter's and National's LinkedIn pages. New posts are reposted to `#linkedin-feed` to encourage brothers to "Like" and "Share", boosting algorithm visibility.
*   **Discord to LinkedIn:** A simplified workflow where an E-Board member can type a command or fill a form in a specific Discord channel to draft a LinkedIn post, which is then scheduled via n8n.

### 4.2 MS Office 365 Bridge
*   **Calendar Sync:** Use n8n to sync the "Chapter Executive" Outlook Calendar with Discord Scheduled Events. Changes in Outlook reflect in Discord automatically.
*   **Email Notifications:** Create a workflow where urgent emails from National (filtered by subject/sender in Outlook) trigger an alert in the `#officer-chat` channel, ensuring the E-Board never misses a deadline.
*   **Document Management:** When meeting minutes are uploaded to the Chapter SharePoint/OneDrive, n8n can post a "Read Only" link to the `#meeting-minutes` channel.
*   **The Weekly Digest:** To combat notification fatigue, an automated email is sent every Friday afternoon summarizing the top 3 announcements and upcoming events from Discord. This ensures busy professionals stay informed without needing to log in daily.

### 4.3 Operational Automation
*   **Meeting Reminders:** A cron job in n8n triggers every meeting day at 9 AM, tagging `@ΓΠ Brother` in `#announcements` with the agenda.
*   **Dues Reminders:** Integration with payment platforms (like Stripe or PayPal webhooks) to privately DM the Treasurer when a payment is received.

### 4.4 Educational Content (The "Pillar" Workflow)
*   *Enhancement:* Expand the current `n8n_workflow.json` to not just post a fact, but post a **Poll** asking a trivia question related to that fact 1 hour later.

## 5. Custom Discord App Concepts
The custom bot (e.g., **"FiotaBot"**) will be self-hosted on **Hostinger** alongside the n8n instance.

### 5.1 Concept A: The Candidate Engagement Pipeline
*   **Purpose:** Serve as the hub for **Application Reviews, Interviews, and Decisions**, while keeping educational content on the external LMS.
*   **Feature - Pipeline Status:** The bot tracks where a professional is in the funnel.
    *   *Commands:* `/candidate status user:@JohnDoe set:Interview_Phase`
    *   *Effect:* Updates the user's role and grants access to specific scheduling channels (e.g., `#interview-prep`) while keeping the rest of the brotherhood informed via a read-only `#candidate-updates` feed.
*   **Feature - Opacity Control (Permissions):**
    *   **Line Committee:** New Role. Has full access to `#application-reviews` and `#interview-debriefs`.
    *   **General Brother:** Has access to `#meet-the-candidates` to engage, but *cannot* see sensitive interview scores or internal debates.
*   **Feature - Line Identity Management:**
    *   **Legacy Preservation:** The bot manages "Vanity Roles" for historical lines (e.g., "Founding Line", "Alpha Line", "Spring '24").
    *   **Auto-Assignment:** When a line crosses, the Dean of Pledges runs one command `/cross line:Beta semester:Spring2025` which converts all "Candidates" to "Brothers" and stamps them with their Line Name role.

### 5.2 Concept B: Chapter Meeting Manager
*   **Purpose:** Facilitate formal chapter business.
*   **Feature - Roll Call:** `/attendance` command during the first 15 mins of a meeting. Generates a CSV report for the Secretary.
*   **Feature - Parliamentary Voting:** A command `/motion text:"Allocate $50 for pizza"` creates a formal embed. Brothers vote with ✅ or ❌.

### 5.3 Concept C: Multi-Tiered Access Control

*   **The Gate:** All new users land in a **"Welcome Gate"** channel. They see two distinct buttons.



#### Path A: "I am a Brother" (The Dual-Voucher System)

*   **Process:** The user fills out the "Brother Application" (Name, Chapter, Voucher).

*   **Security:** To prevent "buddy system" bias or accidents, the bot now requires **two (2) separate ΓΠ Brothers** to click **[✅ Verify]** on the ticket.

    *   *Vote 1:* "First Motion" (e.g., The Voucher).

    *   *Vote 2:* "Second Motion" (e.g., An Officer or another Brother).

*   **Result:** Only after 2 confirmations does the user get the "Brother" role.



#### Path B: "I am a Guest / Interest" (LinkedIn Verification)

*   **The Challenge:** Filtering bots/spam without discouraging real professionals.

*   **The Solution:** **"Sign In with LinkedIn" (OAuth)**.

    *   **Cost:** **$0.00**. Uses the free LinkedIn Developer API.

    *   **Process:**

        1.  User clicks "Connect LinkedIn".

        2.  Bot sends a unique link to your Hostinger web server.

        3.  User logs in to LinkedIn.

        4.  System confirms a valid, established profile exists.

    *   **Result:** The bot grants the "Guest" or "Candidate" role. This keeps spammers out because creating fake, aged LinkedIn profiles is resource-intensive.





## 6. Compliance & Risk Management

**CRITICAL:** Before implementing any "Intake" or "Education" features:

*   **Review National Policies:** Verify if Phi Iota Alpha's national bylaws permit digital tracking of intake processes or hosting educational materials on third-party servers (Discord).

*   **Data Privacy:** Ensure no Personally Identifiable Information (PII) of Candidates is stored unencrypted.

*   **Oversight:** Ensure the Chapter Advisor has full Admin access to monitor all channels.



## 7. Implementation Roadmap

1.  **Phase 1 (Foundation):** Set up Categories, Channels, and Roles. Permissions audit.

2.  **Phase 2 (Automation):** Deploy n8n workflows for **LinkedIn**, Meeting Reminders, and **Outlook/Teams integrations**.

3.  **Phase 3 (Custom App):** Develop "Chapter Meeting Manager" (MVP: Attendance & Voting) and deploy to Hostinger.

4.  **Phase 4 (Migration):** Onboard ΓΠ brothers, then alumni, then public/candidates using the **Voucher System**.
