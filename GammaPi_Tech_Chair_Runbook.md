# 🛠️ FiotaBot & Infrastructure Runbook

**Role:** Technology Chair / Server Administrator
**System:** FiotaBot (Node.js) + n8n (Automation) + Hostinger (VPS)

---

## 1. Access & Credentials
*   **VPS (Hostinger):** SSH access via `ssh root@<server_ip>`.
*   **Code Location:** `/root/fiota-bot/`.
*   **Database Location:** `/root/fiota.db` (SQLite).
*   **Secrets:** Defined in `.env` file inside the bot folder. **NEVER share this file.**

---

## 2. Routine Maintenance

### 🔄 Updating the Bot
When a developer pushes changes to GitHub:
1.  **SSH into Server:** `ssh root@...`
2.  **Navigate:** `cd /root/fiota-bot`
3.  **Pull Code:** `git pull`
4.  **Rebuild:** `npm install && npm run build`
5.  **Deploy Commands:** `npm run deploy` (Only needed if new commands were added, but safe to run always).
6.  **Restart:** `pm2 restart FiotaBot`
7.  **Verify:** `pm2 logs FiotaBot` OR `tail -f logs/combined.log`.

### 📜 Rules & Verification Setup
After deploying or updating the bot, ensure the onboarding flow is configured:
1.  **Post Code of Conduct:** Run `/rules` in `#rules-and-conduct` channel.
2.  **Post Verification Gate:** Run `/verify` in `#welcome-gate` channel.
3.  **Configure Permissions:**
    *   `#rules-and-conduct` - Visible to `@everyone`
    *   `#welcome-gate` - Visible only to `✅ Rules Accepted` role
    *   Other channels - Visible only to verified roles (`🦁 ΓΠ Brother`, `🦁 Visiting Brother`, etc.)

### 🛡️ Server Auditing
The audit is now **automated** to run every Monday at 9 AM.
1.  **Security:** No dangerous permissions leaked to `@everyone`.
2.  **Structure:** All required Forums (e.g., `#lions-den`) and Tags exist.
3.  **Roles:** Essential roles like `Line Committee` and `✅ Rules Accepted` haven't been deleted.
*Note: You can adjust the schedule in the `.env` file using the `AUDIT_CRON_SCHEDULE` variable (Standard Cron format).*

### 🚑 The "Bot is Dead" Checklist
If the bot isn't responding:
1.  **Check Process:** Run `pm2 status`. Is status `online` or `errored`?
2.  **Check Logs:** Run `pm2 logs FiotaBot --lines 50`. Look for "Error" in red.
3.  **Restart:** `pm2 restart FiotaBot` usually fixes memory leaks or stuck states.
4.  **Check Disk Space:** `df -h`. If drive is full, clear logs (`pm2 flush`).

---

## 3. Database Management (CRITICAL)
FiotaBot uses **SQLite** (`fiota.db`). This file contains:
*   **User Profiles:** Brother information including name, chapter, industry, phone, etc.
*   **Verification Tickets:** Pending and completed verifications with voucher tracking.
*   **Attendance:** Member meeting records.
*   **Active Votes:** Current poll data (Voting now survives restarts).

### 🛡️ Backup Strategy
You must automate backups.
1.  **Create Backup Script:** `nano /root/backup_db.sh`
    ```bash
    #!/bin/bash
    cp /root/fiota.db /root/backups/fiota_$(date +%Y%m%d).db
    # Optional: Upload to Google Drive via rclone or curl
    ```
2.  **Add to Cron:** `crontab -e`
    ```bash
    0 3 * * * /bin/bash /root/backup_db.sh # Runs daily at 3 AM
    ```

### 📝 Viewing Data (Manual)
To check the database without the bot:
1.  Install `sqlite3`: `apt install sqlite3`
2.  Open DB: `sqlite3 fiota.db`
3.  Query: `SELECT * FROM users WHERE status='BROTHER';`
4.  Exit: `.quit`

---

## 4. Logger & Infrastructure
*   **Auto-Creation:** The bot automatically creates the `logs/` folder on startup.
*   **Logs:**
    *   `logs/error.log`: Look here first for crashes.
    *   `logs/combined.log`: Full trail of user actions and automated audits.

---

## 5. n8n Automation (Weekly Digest)
*   **Access:** `http://<server_ip>:5678`
*   **Credential Expiry:** Microsoft Outlook tokens expire periodically.
    *   **Fix:** Log into n8n > Credentials > Outlook > Re-connect.
*   **Gemini Quota:** If "Did You Know" stops posting, check Google Cloud Console for API quota limits.

---

## 6. Data Maintenance (Quarterly)

### 🏛️ Chapter List Updates
The chapter list (`CHAPTERS` constant in `src/lib/constants.ts`) should be reviewed quarterly.

**Schedule:** First week of January, April, July, October

**Process:**
1.  **Check Source:** Visit [phiota.org/chapters](https://www.phiota.org/chapters)
2.  **Compare:** Cross-reference website list with `CHAPTERS` constant in codebase
3.  **Add New Chapters:**
    *   New colonizations → Add with `hidden: false`
    *   Format:
    ```typescript
    {
      value: 'greek-letters',
      label: 'Full Name Chapter',
      institution: 'University Name',
      state: 'State',
      type: 'Undergraduate',  // or 'Graduate', 'Alumni'
      hidden: false
    }
    ```
4.  **Mark Inactive:** If chapter closes → Add `inactive: true` (don't delete - preserves historical data)
5.  **Deploy:** Submit PR, rebuild bot, run `npm run deploy`, restart PM2
6.  **Special:** Omega chapter is always `hidden: true` (deceased brothers only, E-Board assignment via `/chapter-assign`)

### 💼 Industry List Maintenance
The industry list (`INDUSTRIES` constant in `src/lib/constants.ts`) is based on NAICS taxonomy.

**When to Add Industries:**
*   E-Board reports >3 brothers selected "Other" for same industry
*   Review "Other" selections monthly in database

**Process:**
1.  Query database: `SELECT industry FROM users WHERE industry LIKE '%Other%';`
2.  Identify patterns (e.g., multiple "Blockchain" entries)
3.  Add new industry to `INDUSTRIES` array in alphabetical order
4.  Deploy changes: `npm run build && npm run deploy && pm2 restart FiotaBot`

### 📊 Data Quality Checks
Monthly database hygiene:
```bash
# SSH into server
sqlite3 /root/fiota.db

# Check for unmapped industries
SELECT industry, COUNT(*) FROM users GROUP BY industry ORDER BY COUNT(*) DESC;

# Find incomplete profiles (missing key fields)
SELECT discord_id, first_name, last_name FROM users WHERE industry IS NULL OR city IS NULL;

# Verify all brothers have vouchers recorded
SELECT user_id FROM verification_tickets WHERE status = 'VERIFIED' AND (voucher_1_id IS NULL AND voucher_2_id IS NULL);

# Check rules agreement status (users who haven't agreed)
SELECT discord_id, first_name, last_name FROM users WHERE rules_agreed_at IS NULL AND status = 'BROTHER';
```

---

## 7. Verification Management

### 📋 Verification Ticket Commands
- `/verify` - Post verification gate in channel (admin)
- `/verify-start` - User starts verification (autocomplete for chapter/industry)
- `/verify-override ticket_id:ABC123` - E-Board immediate approval
- `/chapter-assign user:@Brother chapter:Omega` - Assign chapter (including hidden Omega)

### ⏱️ 48-Hour Fallback
Named vouchers get 48-hour priority to approve tickets. After 48 hours, any brother can approve.
E-Board can use `/verify-override` for immediate verification at any time.

### 👤 Profile Management
Brothers can update their own profiles:
- `/profile-update` - Opens modal to update don name, phone, job title, city

---

## 8. Security Protocols
*   **New Tech Chair Transition:**
    1.  Rotate the **Discord Bot Token** in Developer Portal.
    2.  Rotate **Hostinger SSH Keys/Password**.
    3.  Update `.env` on the server with new token.
    4.  Restart Bot.
*   **Spam Attack:**
    1.  Bot is getting spammed with fake verifications?
    2.  Temporarily disable the `/verify-start` command permissions in Discord Server Settings > Integrations.

---

## 9. Key Files Reference

| File | Purpose |
|------|---------|
| `src/lib/constants.ts` | CHAPTERS (80+) and INDUSTRIES (50) constants |
| `src/lib/validation.ts` | Input validation utilities |
| `src/lib/displayNameBuilder.ts` | Don name display formatting |
| `src/modules/access/accessHandler.ts` | Verification flow logic |
| `src/modules/audit/serverConfig.ts` | Golden State configuration |
| `src/commands/verify-start.ts` | Multi-step verification command |
| `src/commands/verify-override.ts` | E-Board override command |
| `src/commands/chapter-assign.ts` | E-Board chapter assignment |
| `src/commands/profile-update.ts` | User profile updates |

---
**Maintained by Gamma Pi Tech Chair**
*Semper Parati, Semper Juncti.*
