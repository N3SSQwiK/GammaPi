# FiotaBot & Discord Migration: Standard Operating Procedure (SOP) & Implementation Guide

**Document Version:** 2.0
**Target Audience:** Chapter Administrators / Tech Chair (Beginner Level)
**Prerequisites:** Admin access to Hostinger (VPS), Discord, and a Web Browser.

---

## 🏗️ Phase 1: Environment Setup (The Foundation)

### 1.1 Discord Developer Portal Setup
*Goal: Create the "Robot" identity on Discord's servers.*

1.  **Go to:** [https://discord.com/developers/applications](https://discord.com/developers/applications) and log in with your Discord account.
2.  **Click:** The "New Application" button (top right).
3.  **Name It:** Enter `FiotaBot` (or your preferred name) and click Create.
4.  **Create Bot User:**
    *   On the left sidebar, click **Bot**.
    *   Click **Reset Token**.
    *   **CRITICAL:** A long string of random characters will appear. **Copy this immediately.** This is your `DISCORD_TOKEN`. Paste it into a Notepad/Text file for later. You cannot see it again.
    *   Scroll down to "Privileged Gateway Intents". **Toggle ON** all three:
        *   ✅ Presence Intent
        *   ✅ Server Members Intent
        *   ✅ Message Content Intent
    *   Click "Save Changes".
5.  **Get Client ID:**
    *   On the left sidebar, click **OAuth2**.
    *   Copy the **Client ID** (a long number). Save this as `CLIENT_ID`.
6.  **Invite Bot to Server:**
    *   On the left sidebar, click **OAuth2** -> **URL Generator**.
    *   **Scopes:** Check `bot` and `applications.commands`.
    *   **Bot Permissions:** Check `Administrator` (easiest for setup) or specific perms (Manage Roles, Manage Channels, Send Messages).
    *   **Copy URL:** Copy the link at the bottom.
    *   **Paste in Browser:** Open a new tab, paste the link, select your "Gamma Pi" server, and click Authorize.
    *   *Result:* You should see FiotaBot appear in your Discord member list (offline).

### 1.2 Hostinger (VPS) Preparation
*Goal: Get the server ready to run the code.*

1.  **Login:** Log in to your Hostinger Control Panel -> VPS Management.
2.  **Open Terminal:** Use the "Browser Terminal" provided by Hostinger OR use a tool like PuTTY (Windows) or Terminal (Mac).
    *   Command: `ssh root@your_server_ip` (Enter password when prompted).
3.  **Install Node.js (The Engine):**
    *   Run this command to get the latest version manager:
        ```bash
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
        ```
    *   Close the terminal window and open it again (to refresh).
    *   Install Node.js:
        ```bash
        nvm install --lts
        ```
    *   Verify it works: `node -v` (Should say v18.x or v20.x).
4.  **Install PM2 (The Supervisor):**
    *   PM2 keeps the bot running even if you disconnect.
    *   Command: `npm install -g pm2`

---

## 🤖 Phase 2: Deploying FiotaBot

### 2.1 Uploading the Code
*Goal: Move the code from your computer to the Hostinger server.*

1.  **Method A (SCP/SFTP - Recommended):**
    *   Use a program like **FileZilla** or **WinSCP**.
    *   **Host:** `sftp://your_server_ip`
    *   **User:** `root`
    *   **Pass:** Your VPS password.
    *   **Action:** Drag and drop the entire `fiota-bot` folder from your computer to the `/root/` folder on the server.
2.  **Method B (Git - Advanced):**
    *   If the code is on GitHub, just run `git clone https://github.com/your-repo/fiota-bot.git`.

### 2.2 Configuration
1.  **Navigate to Folder:**
    ```bash
    cd /root/fiota-bot
    ```
2.  **Create Secrets File:**
    *   Command: `nano .env`
    *   This opens a text editor inside the terminal.
    *   Paste the following (Right-click usually pastes):
        ```env
        DISCORD_TOKEN=paste_your_token_here
        CLIENT_ID=paste_your_client_id_here
        GUILD_ID=your_server_id
        VERIFICATION_CHANNEL_ID=id_of_private_admin_channel
        AUDIT_CHANNEL_ID=id_of_officer_notification_channel
        AUDIT_CRON_SCHEDULE="0 9 * * 1"
        ```
    *   **Variables Explained:**
        *   `VERIFICATION_CHANNEL_ID`: Where the "Voucher Tickets" go for brothers to approve.
        *   `AUDIT_CHANNEL_ID`: Where the weekly security report is posted.
    *   **Save:** Press `Ctrl+O`, then `Enter`.
    *   **Exit:** Press `Ctrl+X`.

### 2.3 Installation & Startup
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *   *Note:* Use `npm install` for **first-time setup only**. For subsequent updates, see Section 2.4.
2.  **Build the Bot:**
    ```bash
    npm run build
    ```
    *   *Success Check:* If you see no red errors, you are good.
3.  **Register Slash Commands:**
    *   **CRITICAL STEP:** This tells Discord what commands exist.
    ```bash
    npm run deploy
    ```
    *   *Success Check:* "Successfully reloaded application (/) commands."
4.  **Start with PM2:**
    ```bash
    pm2 start dist/index.js --name "FiotaBot"
    ```
    *   *Success Check:* You will see a table with "FiotaBot" listed as "online".
4.  **Save Startup List:**
    *   Ensure it starts if the server reboots:
    ```bash
    pm2 save
    pm2 startup
    ```

### 2.4 Updating the Bot (After Initial Setup)
For subsequent updates after the bot is already running:
1.  **Pull Latest Code:**
    ```bash
    git pull
    ```
    *   *If you get a conflict* (especially with `package-lock.json`), run:
    ```bash
    git checkout -- fiota-bot/package-lock.json
    git pull
    ```
2.  **Clean Install Dependencies:**
    ```bash
    npm ci
    ```
    *   **IMPORTANT:** Use `npm ci` (not `npm install`) for updates. It installs exactly what's in the lock file without modifying it.
3.  **Rebuild & Deploy:**
    ```bash
    npm run build
    npm run deploy
    ```
4.  **Restart Bot:**
    ```bash
    pm2 restart FiotaBot
    ```
    *   *Note:* Process name is case-sensitive (`FiotaBot`, not `fiota-bot`).

---

## 🔗 Phase 3: n8n Automation (The Weekly Digest)

### 3.1 Setup n8n
1.  **Access:** Open `http://your_server_ip:5678` in your browser. (Assuming n8n is already installed per your setup).
2.  **Create New Workflow:** Click "Add Workflow".

### 3.2 Configure the "Weekly Digest"
1.  **Trigger:** Add a **Cron** node.
    *   Mode: `Every Week`
    *   Hour: `16` (4 PM)
    *   Day: `Friday`
2.  **Get Discord Messages:** Add a **Discord** node.
    *   Operation: `Get Many` (or `Get Messages`).
    *   Limit: `10`.
    *   Channel ID: Paste the ID of your `#announcements` channel.
3.  **Filter Important Info (Optional):** Add a **Code** node (JavaScript) to filter for messages with "❗️" or "@everyone".
4.  **Send Email:** Add a **Microsoft Outlook** node (since you use MS Office).
    *   You will need to sign in with the Chapter's Outlook account.
    *   **To:** Use a mailing list email or a comma-separated list.
    *   **Subject:** "🦁 Gamma Pi Weekly Digest"
    *   **Body:** Map the text from the Discord node into the body.

---

## 🛡️ Phase 4: Operational Usage Guide

### 4.0 Fresh Server Setup (First Time Only)
*Complete these steps in order on a brand new Discord server:*

1.  **Create Server Structure:**
    *   **Command:** `/setup`
    *   **Bot:** Creates all required roles and channels (Golden State).
    *   *Note:* Manually arrange channel categories after this.

2.  **Bootstrap First Brothers (Chicken-and-Egg Solution):**
    *   **Problem:** Verification requires 2 brothers to approve, but fresh install has none.
    *   **Solution:** Server owner uses `/bootstrap` to self-register.
    *   **Command:** `/bootstrap`
    *   **Bot:** Shows modal for: First Name, Last Name, Don Name (optional), Year & Semester.
    *   **Result:** Owner becomes first brother with 🦁 ΓΠ Brother role.
    *   **Repeat:** Have one more founding brother join and use `/bootstrap`.
    *   *Note:* `/bootstrap` auto-disables after 2 brothers exist.

3.  **Set Up Rules Channel:**
    *   **Navigate:** Go to `#rules-and-conduct` channel.
    *   **Command:** Type `/rules`.
    *   **Bot:** Posts the Code of Conduct embed with "I Agree" button.

4.  **Set Up Verification Gate:**
    *   **Navigate:** Go to `#welcome-gate` channel.
    *   **Command:** Type `/verify`.
    *   **Bot:** Posts the verification gate explaining the `/verify-start` flow.
    *   **Permissions:** Ensure `#welcome-gate` is only visible to users with `✅ Rules Accepted` role.

### 4.1 How to Verify a New Brother (Multi-Step Flow)
1.  **New Brother:** Joins Discord. Lands in `#rules-and-conduct`.
2.  **New Brother:** Reads Code of Conduct. Clicks **[✅ I Agree to the Code of Conduct]**.
    *   *Bot Response:* "Thank you! You now have access to #welcome-gate."
3.  **New Brother:** Goes to `#welcome-gate`. Runs `/verify-start`.
    *   Selects **Chapter** from autocomplete (80+ options)
    *   Selects **Industry** from autocomplete (50 options)
4.  **Step 1 Modal:** Fills out identity info:
    *   First Name, Last Name, Don Name (optional)
    *   Year & Semester (e.g., "2015 Spring")
    *   Job Title
5.  **New Brother:** Clicks "Continue to Step 2" button.
6.  **Step 2 Modal:** Fills out contact and voucher info:
    *   Phone Number, City
    *   Voucher 1 Name (e.g., "Don Phoenix" or "John Smith")
    *   Voucher 2 Name
7.  **Bot:** Posts verification ticket in `#pending-verifications`.
8.  **Voucher 1:** Sees the ticket. Clicks **[Approve]**.
    *   *Bot Response:* "1/2 Approvals. Pending one more."
9.  **Voucher 2:** Clicks **[Approve]**.
    *   *Bot Response:* "Verified! Access Granted."
10. **Result:** Brother receives 🦁 ΓΠ Brother role.

### 4.2 E-Board Override (Immediate Verification)
If vouchers are unavailable or verification is stuck:
1.  **E-Board:** Run `/verify-override ticket_id:ABC123`
2.  **Bot:** Immediately verifies the user without waiting for approvals.

### 4.3 Assigning Special Chapters (Including Omega)
For deceased brothers or special assignments:
1.  **E-Board:** Run `/chapter-assign user:@Brother chapter:Omega`
2.  **Bot:** Updates the brother's chapter. Omega is hidden from public verification.

### 4.4 How to Take Attendance
1.  **Secretary:** Goes to `#meeting-attendance`.
2.  **Command:** Types `/attendance duration:15`.
3.  **Bot:** Posts a green button "Check In".
4.  **Brothers:** Click the button. Bot replies "Checked In!".
5.  **Secretary:** After 15 mins, bot posts "Attendance Closed" (and saves list to database).

### 4.5 How to Run a Security Audit
1.  **Tech Chair:** Wants to ensure no permissions are broken.
2.  **Command:** `/audit`.
3.  **Bot:** Scans all roles and channels.
4.  **Result:** Returns a report.
    *   ✅ "All Systems Nominal" = Good.
    *   🔴 "CRITICAL: @everyone has Admin" = Fix immediately.
    *   ⚠️ "Missing Tag" = Go add the tag to the Forum.

### 4.6 How to Export Data for Reporting (Power Query/Excel/Power BI)
*Goal: Extract chapter data for reports, dashboards, or analysis.*

**Step 1: Run the Export on VPS**
1.  **Open Terminal:** New terminal on your Mac.
2.  **SSH into VPS:**
    ```bash
    ssh root@YOUR_VPS_IP
    ```
3.  **Navigate & Export:**
    ```bash
    cd /root/GammaPi/fiota-bot
    npm run export
    ```
4.  **Verify Output:** You should see:
    ```
    ✅ Exported users: X rows
    ✅ Exported verification_tickets: X rows
    ✅ Exported attendance: X rows
    ✅ Exported votes: X rows
    ```
5.  **Exit VPS:** Type `exit`.

**Step 2: Download CSVs to Your Mac**
1.  **Open New Terminal:** (Not SSH'd into VPS)
2.  **Download Files:**
    ```bash
    scp "root@YOUR_VPS_IP:/root/GammaPi/fiota-bot/exports/*.csv" ~/Downloads/
    ```
    *   **IMPORTANT:** The quotes are required on Mac (zsh) to prevent glob expansion errors.

**Step 3: Import into Power Query**
1.  **Excel:** Data → Get Data → From Text/CSV
2.  **Power BI:** Get Data → Text/CSV
3.  **Select File:** Choose `users.csv`, `attendance.csv`, etc. from Downloads.

**Exported Files:**
| File | Contents |
|------|----------|
| `users.csv` | Brother profiles (name, chapter, industry, job title, location) |
| `verification_tickets.csv` | Verification request history and approvals |
| `attendance.csv` | Meeting attendance records |
| `votes.csv` | Poll voting records |
| `_export_metadata.json` | Export timestamp and summary |

---

## 📋 Command Reference

| Command | Permission | Description |
|---------|------------|-------------|
| `/setup` | Admin | Create missing roles/channels (Golden State) |
| `/bootstrap` | Server Owner | Seed first brothers on fresh install |
| `/rules` | Admin | Post Code of Conduct embed |
| `/verify` | Admin | Post verification gate embed |
| `/verify-start` | Everyone | Start multi-step verification |
| `/verify-override` | Admin | Override a pending ticket |
| `/chapter-assign` | Admin | Assign chapter to brother |
| `/profile-update` | Everyone | Update your profile |
| `/find` | Everyone | Search brother directory |
| `/mentor` | Everyone | Toggle mentorship availability |
| `/attendance` | Admin | Start attendance check-in |
| `/audit` | Admin | Run server security audit |

---

## 🆘 Troubleshooting

*   **Bot is Offline:**
    *   Log into VPS. Run `pm2 status`.
    *   If stopped, run `pm2 restart FiotaBot`.
    *   Check logs: `pm2 logs FiotaBot`.
*   **Commands not showing up:**
    *   Run `npm run deploy` to re-register commands.
    *   Sometimes Discord takes an hour to refresh commands.
    *   Kick the bot and re-invite it using the link from Step 1.6.
*   **Autocomplete not working:**
    *   Ensure you've run `npm run deploy` after any command changes.
    *   Check that the bot has proper permissions in the channel.

---
**End of Guide**
