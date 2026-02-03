# Gamma Pi Discord Server SOP

**Standard Operating Procedures for the Gamma Pi Digital Hub**

**Version:** 3.0
**Last Updated:** January 2026

---

## Quick Reference

| I need to... | Go to... |
|--------------|----------|
| Verify as a new brother | [Section 1.1.2](#112-brother-verification) |
| Find a brother by industry | [Section 1.2.1](#121-find-a-brother) |
| Check in to a meeting | [Section 1.3.1](#131-attendance) |
| Set up the bot for the first time | [Part 4: Bot Administration](#part-4-bot-administration) |
| Update the bot after code changes | [Section 5.1](#51-updating-the-bot) |
| Fix a broken bot | [Section 5.6](#56-troubleshooting) |
| Export data for reports | [Section 5.4](#54-data-export-for-reporting) |
| Back up the database | [Section 5.3](#53-database-backups) |
| Onboard a new Tech Chair | [Section 6.2](#62-tech-chair-transition) |

---

## Table of Contents

### Part 1: Brother's Field Guide
- [1.1 Access & Verification](#11-access--verification)
  - [1.1.1 Rules Agreement](#111-rules-agreement)
  - [1.1.2 Brother Verification](#112-brother-verification)
  - [1.1.3 Updating Your Profile](#113-updating-your-profile)
- [1.2 The Professional Rolodex](#12-the-professional-rolodex)
  - [1.2.1 Find a Brother](#121-find-a-brother)
  - [1.2.2 Mentorship (Office Hours)](#122-mentorship-office-hours)
  - [1.2.3 The Lions' Den (Personal Blogs)](#123-the-lions-den-personal-blogs)
- [1.3 Chapter Operations](#13-chapter-operations)
  - [1.3.1 Attendance](#131-attendance)
  - [1.3.2 Voting](#132-voting)
- [1.4 Rules of Engagement](#14-rules-of-engagement)
- [1.5 Quick Command Reference](#15-quick-command-reference)

### Part 2: Forum Channel Guidelines
- [2.1 Philosophy: Text vs. Forum](#21-philosophy-text-vs-forum)
- [2.2 Forum A: The Career Center](#22-forum-a-the-career-center)
- [2.3 Forum B: Chapter Projects & Committees](#23-forum-b-chapter-projects--committees)
- [2.4 Forum C: Pan-American Library](#24-forum-c-pan-american-library)
- [2.5 Forum D: Tech Support](#25-forum-d-tech-support)
- [2.6 Forum E: The Lions' Den](#26-forum-e-the-lions-den)
- [2.7 Forum Setup Guide (Tech Chair)](#27-forum-setup-guide-tech-chair)

### Part 3: Permission Standards
- [3.1 Permission Philosophy](#31-permission-philosophy)
- [3.2 Role vs. Permission Matrix](#32-role-vs-permission-matrix)
- [3.3 Detailed Role Definitions](#33-detailed-role-definitions)
  - [3.3.1 E-Board](#331-e-board)
  - [3.3.2 Line Committee](#332-line-committee)
  - [3.3.3 ΓΠ Brother](#333-γπ-brother)
  - [3.3.4 Visiting Brother & Alumni](#334-visiting-brother--alumni)
  - [3.3.5 Candidate / Interest](#335-candidate--interest)
  - [3.3.6 Guest / Public](#336-guest--public)
- [3.4 Channel Overrides](#34-channel-overrides)
- [3.5 Permission Setup Guide (Tech Chair)](#35-permission-setup-guide-tech-chair)

### Part 4: Bot Administration
- [4.1 Discord Developer Portal Setup](#41-discord-developer-portal-setup)
- [4.2 VPS (Hostinger) Preparation](#42-vps-hostinger-preparation)
- [4.3 Deploy the Bot](#43-deploy-the-bot)
- [4.4 Fresh Server Initialization](#44-fresh-server-initialization)
- [4.5 Admin Command Reference](#45-admin-command-reference)
- [4.6 Verification Administration](#46-verification-administration)
- [4.7 Security Audits](#47-security-audits)

### Part 5: System Maintenance
- [5.1 Updating the Bot](#51-updating-the-bot)
- [5.2 Database Overview](#52-database-overview)
- [5.3 Database Backups](#53-database-backups)
- [5.4 Data Export for Reporting](#54-data-export-for-reporting)
- [5.5 Quarterly Maintenance](#55-quarterly-maintenance)
- [5.6 Troubleshooting](#56-troubleshooting)

### Part 6: Advanced Administration
- [6.1 Security Protocols](#61-security-protocols)
- [6.2 Tech Chair Transition](#62-tech-chair-transition)
- [6.3 Limited Operator Accounts](#63-limited-operator-accounts)
- [6.4 n8n Automation](#64-n8n-automation)
- [6.5 Key Files Reference](#65-key-files-reference)

---

# Part 1: Brother's Field Guide

**Welcome, Brother!**

You have entered the new digital headquarters for the Gamma Pi Chapter. This isn't just a group chat; it's a professional tool designed to help us operate efficiently and network powerfully.

This guide will teach you how to use **FiotaBot**, our custom AI assistant, and navigate the server like a pro.

---

## 1.1 Access & Verification

### 1.1.1 Rules Agreement

When you first join, you will see the **#rules-and-conduct** channel.

1. Read the **Code of Conduct** carefully.
2. Click **[✅ I Agree to the Code of Conduct]** button.
3. You now have access to **#welcome-gate** for verification.

### 1.1.2 Brother Verification

After agreeing to the rules, complete your verification:

1. **Start Verification:** Run the `/verify-start` command.
   - Select your **Chapter** (type to search 80+ chapters)
   - Select your **Industry** (type to search 50 categories)

2. **Step 1 - Identity:** A modal appears asking for:
   - **First Name** and **Last Name** (required)
   - **Don Name** (required - your brother name, e.g., "Phoenix")
   - **Year & Semester** (e.g., "2015 Spring")
   - **Job Title**

3. **Step 2 - Contact & Vouchers:** Click "Continue to Step 2" button, then fill:
   - **Phone Number** (for brother networking)
   - **City** (your current location)
   - **Voucher 1 Name** (name a brother who can vouch for you)
   - **Voucher 2 Name** (name a second brother)

4. **Wait for Approval:** Two brothers must approve your ticket.
   - Named vouchers are notified first
   - After 48 hours, any brother can approve
   - Once approved, the server unlocks!

### 1.1.3 Updating Your Profile

Already verified? Update your information anytime:

- **Command:** `/profile-update`
- You can update: Don Name, Phone, Job Title, City

---

## 1.2 The Professional Rolodex

Stop shouting "Does anyone know someone in Finance?" into the void. Use the database.

### 1.2.1 Find a Brother

- **Command:** `/find`
- **Usage:** Type `/find` and hit Tab. You can filter by:
  - `industry`: e.g., "Technology / Software", "Finance / Banking"
  - `city`: e.g., "New York", "Chicago"
- **Example:** `/find industry:Marketing` → Returns brothers in Marketing

**Note:** Brothers with Don Names appear as "Don Phoenix" in search results.

### 1.2.2 Mentorship (Office Hours)

Willing to chat with younger brothers or candidates? Toggle your status.

- **Command:** `/mentor status:On`
- **Result:** You get the `🧠 Open to Mentor` badge on your profile.
- **Command:** `/mentor status:Off` (When you get too busy)

### 1.2.3 The Lions' Den (Personal Blogs)

Instead of 50 separate channels, we have **one** Forum called `#lions-den`.

1. **Create Your Space:** Post a new thread titled *"Nexus's Blog"* or *"John's Gym Log"*
2. **Tag It:** Use tags like `🏋️ Fitness` or `🎮 Gaming` so others can find you
3. **Post Updates:** Treat this thread like your personal social feed
4. **Follow:** Click the "Follow" (Bell) icon on brothers' threads you want to see updates from

---

## 1.3 Chapter Operations

For Active Brothers, business is handled here.

### 1.3.1 Attendance

Don't wait for a paper sheet.

1. Look for the **Green [Check In] Button** in the chat during a meeting
2. Click it
3. Done. (The bot logs your time)

### 1.3.2 Voting

1. When a motion is on the floor, the bot will post a "Poll Embed"
2. Click ✅ for "Aye", ❌ for "Nay", or 🤷 for "Abstain"
3. Votes are counted automatically

---

## 1.4 Rules of Engagement

1. **Respect the Channels:**
   - `#announcements`: Read-only. Important info lives here.
   - `#general-chat`: The "Living Room". Banter goes here.
   - `#sensitive-matters`: Strictly confidential. What is posted here, stays here.

2. **Reply vs. New Message:**
   - If you are responding to a specific conversation, use the **Reply** function (Right-click → Reply)
   - If a conversation gets deep/long, start a **Thread** (Hash icon → Create Thread) to keep the main chat clean

3. **Notifications:**
   - We rarely use `@everyone`. If you get pinged, it's important.
   - Please check the **#weekly-digest** email on Fridays for summaries.

---

## 1.5 Quick Command Reference

| Command | Description |
|---------|-------------|
| `/verify-start` | Start brother verification (new members) |
| `/profile-update` | Update your profile (don name, phone, etc.) |
| `/find` | Search the brother directory |
| `/mentor status:On/Off` | Toggle mentorship availability |
| `/attendance` | Check in to a meeting |

---

# Part 2: Forum Channel Guidelines

Forum channels are for persistent, topical, and organized discussions. They prevent important information from being lost in the fast-moving chronological feed of standard text channels.

---

## 2.1 Philosophy: Text vs. Forum

- **Standard Text Channels (#general, #banter):** Use for real-time, fleeting conversation. If the information is irrelevant in 24 hours, post it here.
- **Forum Channels:** Use for "Topics of Record." If a brother should be able to find this information two weeks from now, it belongs in a Forum.

---

## 2.2 Forum A: The Career Center

**Purpose:** Professional networking, job leads, and career development.

### Tags

| Tag | Usage |
|-----|-------|
| `💼 Hiring` | When you or your company have an open role |
| `👀 Seeking` | When looking for a new opportunity |
| `📄 Resume` | For brothers seeking feedback on their professional documents |
| `💡 Advice` | For career pivots, interview prep, or industry questions |
| `📍 Remote` | For location-independent roles |
| `📍 Local` | For region-specific roles (e.g., NYC, Chicago, Miami) |

### Examples

- "Director of Ops role at [Company] - I can refer."
- "Critique my resume: Transitioning from Engineering to Product Management."
- "Tech layoffs discussion: Resources and support thread."

---

## 2.3 Forum B: Chapter Projects & Committees

**Purpose:** Planning and executing chapter business, events, and community service.

### Tags

| Tag | Usage |
|-----|-------|
| `🎉 Social` | Event planning for brotherhood mixers or galas |
| `🤝 Service` | Organizing community service and philanthropy |
| `💰 Fundraising` | Chapter dues, donation drives, and scholarship funds |
| `📅 Planning` | For events currently in the logistics phase |
| `🗳️ Vote Needed` | To signal a thread requires E-Board or Chapter consensus |
| `✅ Approved` | To mark a project as finalized |

### Examples

- "Annual Domino Tournament 2026 - Venue Selection."
- "Phi Iota Alpha Scholarship Fund: Outreach Strategy."
- "Joint Service Event with [Other Chapter] - Logistics Thread."

---

## 2.4 Forum C: Pan-American Library

**Purpose:** Intellectual discourse on history, culture, and Pan-Americanism (phiota.org mission).

### Tags

| Tag | Usage |
|-----|-------|
| `🏛️ History` | Discussion regarding our 5 Pillars or Fraternity founding |
| `🌎 Current Events` | Politics and news across Latin America and the Diaspora |
| `📚 Book Club` | Monthly reading lists and literary discussion |
| `⚖️ Debate` | For structured, respectful arguments on complex topics |
| `🦁 Brotherhood` | Reflections on the mission and values of Phi Iota Alpha |

### Examples

- "Analyzing Bolivar's 'Letter from Jamaica' in 2026."
- "The Impact of Emerging Tech on Latin American Economies."
- "Monthly Book Club: 'Open Veins of Latin America' by Eduardo Galeano."

---

## 2.5 Forum D: Tech Support

**Purpose:** Reporting issues with FiotaBot or the Discord server.

### Tags

| Tag | Usage |
|-----|-------|
| `🐛 Bug` | Something isn't working (e.g., "The /find command is broken") |
| `✨ Feature` | Suggesting a new command or automation |
| `🔧 Fixed` | Marked by the Tech Chair once resolved |

---

## 2.6 Forum E: The Lions' Den

**Purpose:** A dedicated space for each Brother to have their own "feed" or "blog."

**Why use a Forum?**

Instead of creating 50+ separate text channels (which clutters the sidebar and creates ghost towns), we use **one** Forum. Each Brother creates **one Thread** that serves as their personal space. Other brothers can "Follow" specific threads they care about without being overwhelmed.

### Tags

| Tag | Usage |
|-----|-------|
| `👋 My Life` | General updates, family, and daily musings |
| `🏋️ Fitness` | Tracking gym progress or marathon training |
| `👨‍💻 Projects` | Showcasing side hustles, code, or DIY builds |
| `🎮 Gaming` | Stream updates or LFG (Looking For Group) |
| `🍳 Food` | Cooking and restaurant adventures |

### Examples

- **Post Title:** "Nexus's Tech & Travel Journal"
  - *Content:* "Just landed in Tokyo! Here are some photos..."
- **Post Title:** "John's Road to the NYC Marathon"
  - *Content:* "Week 4 training logs. 15 miles today."

---

## 2.7 Forum Setup Guide (Tech Chair)

1. **Enable Communities:** Ensure your server is set to a "Community Server" in Discord settings to unlock Forums.
2. **Creation:** Right-click a Category → Create Channel → Forum.
3. **Permissions:**
   - Set **"Who can create posts"** to ΓΠ Brother or higher for Chapter Projects.
   - Allow Guests to **"View"** the Career Center but consider restricting **"Post"** to Brothers only to maintain lead quality.
4. **Guidelines:** Copy the "Purpose" and "Tags" from this document into the Discord "Post Guidelines" sidebar for each channel.

---

# Part 3: Permission Standards

This section defines the server-level permissions for the Gamma Pi Discord server. It aligns with the **Role-Based Access Control (RBAC)** strategy.

---

## 3.1 Permission Philosophy

The security model depends on **"Least Privilege"**: users should only have the permissions necessary to fulfill their role. This prevents accidents (e.g., deleting a channel) and reduces "notification fatigue" (e.g., abusing `@everyone`).

### Key Strategies

| Strategy | Implementation |
|----------|----------------|
| **The Baseline (@everyone)** | Strip almost all permissions from the default `@everyone` role. Ensures unverified users cannot disrupt the server. |
| **Noise Control** | Only **E-Board** can use "Mention @everyone/here". Preserves the sanctity of the notification ping. |
| **Safety** | Only **E-Board** and **Line Committee** can Manage Messages (delete) or Kick/Ban. |
| **Engagement** | All "Brother" roles are encouraged to use "Add Reactions" and "External Emojis" to foster a fun culture. |

---

## 3.2 Role vs. Permission Matrix

**Legend:**
- ✅ = **Granted** (Server-Wide)
- ❌ = **Denied**
- 🔸 = **Channel Specific** (Granted only in specific categories via overrides)

| Permission Category | Permission Flag | 🦁 E-Board | 🦁 Line Comm. | 🦁 ΓΠ Brother | 🦁 Visiting | 🦁 Alumni | 👔 Candidate | 🌍 Guest |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **General** | Administrator | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | View Channels | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 | 🔸 |
| | Manage Channels | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Manage Roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | View Audit Log | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Membership** | Create Invite | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| | Change Nickname | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| | Manage Nicknames | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Kick/Ban Members | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Text** | Send Messages | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 | 🔸 |
| | Embed Links | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| | Attach Files | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 | ❌ |
| | Add Reactions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| | Use Ext. Emojis | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| | Mention @everyone | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Manage Messages | ✅ | 🔸 | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Read Msg History | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Voice** | Connect / Speak | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 | ❌ |
| | Video / Screen | ✅ | ✅ | ✅ | ✅ | ✅ | 🔸 | ❌ |
| | Priority Speaker | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Mute/Deafen Others | ✅ | 🔸 | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Move Members | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3.3 Detailed Role Definitions

### 3.3.1 E-Board

- **Rationale:** These users manage the infrastructure.
- **Critical Permissions:** `Administrator`. This bypasses all channel restrictions.
- **Responsibility:** Only the Chapter President, Secretary, and Tech Chair should hold this.

### 3.3.2 Line Committee

- **Rationale:** Needs to manage the intake process flow without seeing sensitive E-Board channels (Treasury).
- **Special Permissions:**
  - `Manage Nicknames`: To standardize Candidate names (e.g., "Cdt. John Doe")
  - `Move Members`: To drag candidates from a "Waiting Room" voice channel into an "Interview Room"
  - `Priority Speaker`: Useful during interview debriefs to control the floor

### 3.3.3 ΓΠ Brother

- **Rationale:** The core user. Needs full social capability but no destructive power.
- **Key Settings:**
  - `Create Invite`: Allowed. We want them to invite lost brothers.
  - `Attach Files`: Allowed. For sharing resumes or meeting docs.
  - `Mention @everyone`: **DENIED**. Prevents accidental server-wide pings.

### 3.3.4 Visiting Brother & Alumni

- **Rationale:** Guests in our house. We treat them with respect (Social features) but protect our integrity.
- **Key Settings:**
  - `Create Invite`: **DENIED**. They should not be inviting randoms to our server; that is a ΓΠ Brother privilege.
  - `Change Nickname`: Allowed. They can correct their own name.

### 3.3.5 Candidate / Interest

- **Rationale:** Under evaluation. Access is tightly controlled.
- **Key Settings:**
  - `View Channels`: **DENIED** globally. They rely on "Channel Overrides" to see anything.
  - `Change Nickname`: **DENIED**. The Line Committee controls their identity during the process.
  - `Attach Files`: **Granted via Channel Override only** (in `#document-submission` channels), but denied server-wide to prevent spam.

### 3.3.6 Guest / Public

- **Rationale:** Verified humans (via LinkedIn) but not members.
- **Key Settings:**
  - `Send Messages`: **DENIED** globally, except in `#public-chat`.
  - `Read Message History`: Allowed. They can see announcements.

---

## 3.4 Channel Overrides

Server permissions set the *maximum* ability, but Channel Overrides dictate *where* abilities can be used.

### Category: 🗳️ E-BOARD

| Role | View Channel |
|------|--------------|
| @everyone | ❌ |
| 🦁 E-Board | ✅ |

### Category: 🦁 CHAPTER OPS (Treasury, Minutes)

| Role | View Channel | Send Messages |
|------|--------------|---------------|
| @everyone | ❌ | ❌ |
| 🦁 ΓΠ Brother | ✅ | ✅ |
| 🦁 Visiting / Alumni | ❌ | ❌ |

*Strict financial privacy for visiting brothers and alumni.*

### Category: 📚 ONBOARDING (Interview Rooms)

| Role | View Channel | Manage Messages | Connect |
|------|--------------|-----------------|---------|
| @everyone | ❌ | ❌ | ❌ |
| 🦁 Line Committee | ✅ | ✅ | ✅ |
| 👔 Candidate | ✅ (specific channels) | ❌ | ✅ |
| 🦁 ΓΠ Brother | ❌ | ❌ | ❌ |

*Opacity control - active brothers cannot see interview notes.*

### Category: 📣 PUBLIC INFO

| Role | View Channel | Send Messages | Add Reactions |
|------|--------------|---------------|---------------|
| @everyone | ✅ | ❌ | ✅ |
| 🦁 E-Board | ✅ | ✅ | ✅ |

*Only Admins can post announcements.*

---

## 3.5 Permission Setup Guide (Tech Chair)

1. **Create Roles first:** Go to Server Settings → Roles. Create them in the order listed above (Highest rank at the top).

2. **Strip @everyone:** Select `@everyone` and turn **OFF**:
   - `Send Messages`
   - `View Channels` (depending on preference, usually better to leave View on but hide specific Categories)
   - `Create Invite`

3. **Apply Server Perms:** Go through each role and toggle the flags per the Matrix in Section 3.2.

4. **Setup Categories:** Create your Categories (`E-BOARD`, `CHAPTER OPS`, etc.) and set the permissions on the **Category** itself. Toggle "Sync Permissions" for channels inside them.

---

# Part 4: Bot Administration

*Complete this section when first deploying FiotaBot or setting up a new server.*

**Audience:** Tech Chairs, Chapter Administrators

---

## 4.1 Discord Developer Portal Setup

**Goal:** Create the bot identity on Discord's servers.

1. **Go to:** [https://discord.com/developers/applications](https://discord.com/developers/applications)
2. **Click:** "New Application" (top right)
3. **Name it:** `FiotaBot` → Click Create

### Get Bot Token (CRITICAL)
1. Left sidebar → **Bot**
2. Click **Reset Token**
3. **IMMEDIATELY COPY** the token string that appears
4. Save as `DISCORD_TOKEN` — you cannot see it again!

### Enable Intents
Scroll to "Privileged Gateway Intents" and enable:
- ✅ Presence Intent
- ✅ Server Members Intent
- ✅ Message Content Intent

Click "Save Changes"

### Get Client ID
1. Left sidebar → **OAuth2**
2. Copy the **Client ID** (long number)
3. Save as `CLIENT_ID`

### Invite Bot to Server
1. Left sidebar → **OAuth2** → **URL Generator**
2. **Scopes:** Check `bot` and `applications.commands`
3. **Permissions:** Check `Administrator`
4. Copy the generated URL
5. Open in browser → Select your server → Authorize

*Result: FiotaBot appears in your member list (offline until started)*

---

## 4.2 VPS (Hostinger) Preparation

**Goal:** Prepare the server to run the bot.

### Connect to VPS
```bash
ssh root@YOUR_VPS_IP
```

### Install Node.js
```bash
# Install Node Version Manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Restart terminal, then install Node
nvm install --lts

# Verify installation
node -v    # Should show v20.x or higher
```

### Install PM2 (Process Manager)
```bash
npm install -g pm2
```

---

## 4.3 Deploy the Bot

### Upload Code
**Option A - Git (Recommended):**
```bash
git clone https://github.com/YOUR_REPO/GammaPi.git
cd GammaPi/fiota-bot
```

**Option B - SFTP:**
Use FileZilla/WinSCP to upload the `fiota-bot` folder to `/root/GammaPi/`

### Configure Environment
```bash
cd /root/GammaPi/fiota-bot
nano .env
```

Paste and fill in:
```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_discord_server_id
VERIFICATION_CHANNEL_ID=channel_for_verification_tickets
AUDIT_CHANNEL_ID=channel_for_audit_reports
AUDIT_CRON_SCHEDULE="0 9 * * 1"
```

Save: `Ctrl+O` → `Enter` → `Ctrl+X`

### Install, Build, and Start
```bash
npm install              # Install dependencies
npm run build            # Compile TypeScript
npm run deploy           # Register slash commands with Discord
pm2 start dist/index.js --name "FiotaBot"
pm2 save                 # Save for auto-restart
pm2 startup              # Enable on server reboot
```

**Success check:** `pm2 status` shows FiotaBot as "online"

---

## 4.4 Fresh Server Initialization

*Complete these steps on a brand new Discord server.*

### Step 1: Run /init

The `/init` command consolidates all server setup into one step:

```
/init chapter:<your_chapter> industry:<your_industry>
```

**What /init does:**
1. Creates all required roles (Golden State)
2. Creates all required channels with permission overwrites
3. Posts Code of Conduct embed to `#rules-and-conduct`
4. Posts Verification Gate to `#welcome-gate`
5. Shows "Light the Torch" button for founding brother registration

### Step 2: Register Founding Brothers

**Problem:** Verification requires 2 brothers to approve, but a fresh install has none.

**Solution:** The `/init` flow includes founding brother registration:
1. Click "🦁 Light the Torch" button
2. Fill Modal 1: First Name, Last Name, Don Name, Year & Semester, Job Title
3. Click "Continue to Step 2"
4. Fill Modal 2: Phone Number, City
5. First founding brother receives 🦁 ΓΠ Brother role
6. Have a second founding brother join and repeat the process

**Note:** `/init` auto-disables after 2 brothers exist in the database.

### Step 3: Verify Channel Permissions

| Channel | Visible To |
|---------|------------|
| `#rules-and-conduct` | @everyone |
| `#welcome-gate` | ✅ Rules Accepted |
| All other channels | 🦁 ΓΠ Brother, 🦁 Visiting Brother |

---

## 4.5 Admin Command Reference

| Command | Permission | Description |
|---------|------------|-------------|
| `/init` | Server Owner | Complete server setup (fresh install only) |
| `/rules` | Admin | Re-post Code of Conduct embed (repair) |
| `/verify` | Admin | Re-post verification gate embed (repair) |
| `/verify-start` | Everyone | Start multi-step verification |
| `/verify-override` | E-Board | Override a pending ticket |
| `/chapter-assign` | E-Board | Assign chapter to brother |
| `/profile-update` | Everyone | Update your profile |
| `/find` | Everyone | Search brother directory |
| `/mentor` | Everyone | Toggle mentorship availability |
| `/attendance` | Admin | Start attendance check-in |
| `/audit` | Admin | Run server security audit |

---

## 4.6 Verification Administration

### For New Members
1. **New member joins** → Lands in `#rules-and-conduct`
2. **Reads Code of Conduct** → Clicks **[✅ I Agree]**
   - *Bot grants `✅ Rules Accepted` role*
3. **Goes to `#welcome-gate`** → Runs `/verify-start`
   - Selects Chapter (80+ options with autocomplete)
   - Selects Industry (50 options with autocomplete)
4. **Step 1 Modal:** Identity info
   - First Name, Last Name, Don Name (required)
   - Year & Semester (e.g., "2015 Spring")
   - Job Title
5. **Clicks "Continue to Step 2"**
6. **Step 2 Modal:** Contact and vouchers
   - Phone Number, City
   - Voucher 1 Name (e.g., "Don Phoenix")
   - Voucher 2 Name
7. **Bot posts ticket** in `#pending-verifications`
8. **Named vouchers approve** (or any brother after 48 hours)
9. **After 2 approvals** → Brother receives 🦁 ΓΠ Brother role

### E-Board Override
If vouchers are unavailable:
```
/verify-override ticket_id:ABC123
```
Immediately verifies without waiting for approvals.

### Chapter Assignment
For special cases (including Omega for deceased brothers):
```
/chapter-assign user:@Brother chapter:Omega
```

---

## 4.7 Security Audits

**Automated:** Runs every Monday at 9 AM (configurable via `AUDIT_CRON_SCHEDULE`)

**Manual:**
```
/audit
```

**Results:**
- ✅ "All Systems Nominal" = Good
- 🔴 "CRITICAL: @everyone has Admin" = Fix immediately
- ⚠️ "Missing Tag" = Add the tag to the Forum

---

# Part 5: System Maintenance

*Reference this section for ongoing system maintenance.*

---

## 5.1 Updating the Bot

When code changes are pushed to GitHub:

```bash
# SSH into server
ssh root@YOUR_VPS_IP

# Navigate to bot
cd /root/GammaPi/fiota-bot

# Pull and rebuild
git pull
npm ci                   # Use npm ci, NOT npm install
npm run build
npm run deploy           # If commands changed
pm2 restart FiotaBot     # Case-sensitive!

# Verify
pm2 logs FiotaBot --lines 20
```

**One-liner for quick updates:**
```bash
cd /root/GammaPi/fiota-bot && git pull && npm ci && npm run build && npm run deploy && pm2 restart FiotaBot
```

### Git Pull Conflicts
If you see "local changes would be overwritten" (usually `package-lock.json`):
```bash
git checkout -- package-lock.json
git pull
```

**Prevention:** Always use `npm ci` instead of `npm install` on the server.

---

## 5.2 Database Overview

**Location:** `/root/GammaPi/fiota-bot/fiota.db` (SQLite)

**Tables:**
| Table | Contents |
|-------|----------|
| `users` | Brother profiles (name, chapter, industry, contact) |
| `verification_tickets` | Verification requests and approvals |
| `attendance` | Meeting attendance records |
| `votes` | Poll voting records |

### Manual Queries
```bash
sqlite3 /root/GammaPi/fiota-bot/fiota.db

# Example queries
SELECT * FROM users WHERE status='BROTHER';
SELECT COUNT(*) FROM attendance;
.quit
```

---

## 5.3 Database Backups

### Create Backup Script
```bash
mkdir -p /root/backups
nano /root/backup_db.sh
```

Paste:
```bash
#!/bin/bash
cp /root/GammaPi/fiota-bot/fiota.db /root/backups/fiota_$(date +%Y%m%d).db
echo "Backup created: fiota_$(date +%Y%m%d).db"
```

Make executable:
```bash
chmod +x /root/backup_db.sh
```

### Automate with Cron
```bash
crontab -e
```

Add (runs daily at 3 AM):
```
0 3 * * * /bin/bash /root/backup_db.sh
```

---

## 5.4 Data Export for Reporting

**Goal:** Extract data for Power Query, Excel, or Power BI.

### Step 1: Run Export on VPS
```bash
ssh root@YOUR_VPS_IP
cd /root/GammaPi/fiota-bot
npm run export
```

Output:
```
✅ Exported users: X rows
✅ Exported verification_tickets: X rows
✅ Exported attendance: X rows
✅ Exported votes: X rows
```

### Step 2: Download to Mac
**Open a NEW local terminal** (not SSH'd):
```bash
scp "root@YOUR_VPS_IP:/root/GammaPi/fiota-bot/exports/*.csv" ~/Downloads/
```

> **Note:** Quotes are required on Mac (zsh) to prevent glob expansion errors.

### Step 3: Import into Power Query
- **Excel:** Data → Get Data → From Text/CSV
- **Power BI:** Get Data → Text/CSV

### Exported Files
| File | Contents |
|------|----------|
| `users.csv` | Brother profiles and professional info |
| `verification_tickets.csv` | Verification request history |
| `attendance.csv` | Meeting attendance logs |
| `votes.csv` | Poll voting records |
| `_export_metadata.json` | Export timestamp and summary |

---

## 5.5 Quarterly Maintenance

### Chapter List Updates
**Schedule:** First week of January, April, July, October

1. **Check:** [phiota.org/chapters](https://www.phiota.org/chapters)
2. **Compare:** Website list vs `CHAPTERS` in `src/lib/constants.ts`
3. **Add new chapters:** Format:
   ```typescript
   {
     value: 'greek-letters',
     label: 'Full Name Chapter',
     institution: 'University Name',
     state: 'State',
     type: 'Undergraduate',
     hidden: false
   }
   ```
4. **Mark inactive:** Add `inactive: true` (don't delete)
5. **Deploy changes**

### Industry List Updates
**When:** E-Board reports >3 brothers selected "Other" for same industry

```sql
-- Check "Other" selections
SELECT industry FROM users WHERE industry LIKE '%Other%';
```

### Data Quality Checks
Monthly database hygiene:
```sql
-- Unmapped industries
SELECT industry, COUNT(*) FROM users GROUP BY industry ORDER BY COUNT(*) DESC;

-- Incomplete profiles
SELECT discord_id, first_name, last_name FROM users
WHERE industry IS NULL OR city IS NULL;

-- Brothers without rules agreement
SELECT discord_id, first_name FROM users
WHERE rules_agreed_at IS NULL AND status = 'BROTHER';
```

---

## 5.6 Troubleshooting

### Bot is Offline
```bash
pm2 status                    # Check if running
pm2 logs FiotaBot --lines 50  # Check for errors
pm2 restart FiotaBot          # Restart
df -h                         # Check disk space
pm2 flush                     # Clear logs if disk full
```

### Commands Not Showing
1. Run `npm run deploy` to re-register
2. Wait up to 1 hour for Discord to refresh
3. Kick and re-invite bot if still broken

### Autocomplete Not Working
1. Ensure `npm run deploy` was run after changes
2. Check bot has permissions in the channel

---

# Part 6: Advanced Administration

*Reference this section for security and advanced configuration.*

---

## 6.1 Security Protocols

### Spam Attack Response
If bot is being spammed with fake verifications:
1. Discord Server Settings → Integrations
2. Temporarily disable `/verify-start` command permissions

### Credential Locations
| Credential | Location |
|------------|----------|
| Bot Token | Discord Developer Portal |
| VPS Access | Hostinger Control Panel |
| Environment Vars | `/root/GammaPi/fiota-bot/.env` |

---

## 6.2 Tech Chair Transition

When onboarding a new Tech Chair:

1. **Rotate Discord Bot Token:**
   - Discord Developer Portal → Bot → Reset Token
   - Update `.env` on server
   - Restart bot

2. **Rotate VPS Access:**
   - Hostinger → Change SSH password
   - Or create new operator account (see below)

3. **Update `.env`** with new token

4. **Restart bot:**
   ```bash
   pm2 restart FiotaBot
   ```

---

## 6.3 Limited Operator Accounts

Create restricted accounts for trusted brothers who need bot access without full server control.

### Create Operator User
```bash
ssh root@YOUR_VPS_IP
adduser botoperator
# Do NOT add to sudo group
```

### Grant Limited Permissions
```bash
visudo
```

Add at bottom:
```
botoperator ALL=(root) NOPASSWD: /usr/local/bin/update-fiotabot, /usr/bin/pm2 restart FiotaBot, /usr/bin/pm2 logs FiotaBot, /usr/bin/pm2 status
```

### Create Update Script
```bash
nano /usr/local/bin/update-fiotabot
```

Paste:
```bash
#!/bin/bash
set -e
echo "📦 Pulling latest code..."
cd /root/GammaPi && git pull
echo "📦 Installing dependencies..."
cd fiota-bot && npm ci
echo "🔨 Building..."
npm run build
echo "🚀 Deploying commands..."
npm run deploy
echo "🔄 Restarting bot..."
pm2 restart FiotaBot
echo "✅ FiotaBot updated!"
pm2 status
```

Make executable:
```bash
chmod +x /usr/local/bin/update-fiotabot
```

### Operator Permissions
| Action | Allowed |
|--------|---------|
| Update & restart bot | ✅ |
| View bot logs | ✅ |
| Check bot status | ✅ |
| Install system software | ❌ |
| View server secrets | ❌ |
| Access database directly | ❌ |

---

## 6.4 n8n Automation

**Access:** `http://YOUR_VPS_IP:5678`

### Weekly Digest Setup
1. **Trigger:** Cron node → Every Friday at 4 PM
2. **Get Messages:** Discord node → Get last 10 from `#announcements`
3. **Filter:** Code node → Filter for "❗️" or "@everyone"
4. **Send:** Microsoft Outlook node → Chapter mailing list

### Common Issues
- **Credential Expiry:** Re-authenticate in n8n → Credentials → Outlook
- **Gemini Quota:** Check Google Cloud Console for API limits

---

## 6.5 Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/constants.ts` | CHAPTERS and INDUSTRIES constants |
| `src/lib/validation.ts` | Input validation utilities |
| `src/lib/repositories/` | Database access layer |
| `src/modules/access/accessHandler.ts` | Verification flow logic |
| `src/modules/audit/serverConfig.ts` | Golden State configuration |
| `src/modules/*/requirements.ts` | Module role/channel declarations |

### Adding Server Structure
To add new roles or channels:

1. Create `requirements.ts` in your module:
   ```typescript
   import { registerRequirements } from '../../lib/serverRequirements';
   registerRequirements('my-feature', {
       roles: ['🎯 New Role'],
       channels: [{ name: 'new-channel', type: ChannelType.GuildText }]
   });
   ```

2. Import in `serverConfig.ts`:
   ```typescript
   import '../my-feature/requirements';
   ```

3. Build and deploy:
   ```bash
   npm run build && npm run deploy
   ```

4. Run `/init` or `/audit` in Discord

---

**Maintained by Gamma Pi Tech Chair**
*Semper Parati, Semper Juncti.*
