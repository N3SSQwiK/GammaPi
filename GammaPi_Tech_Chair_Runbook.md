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
5.  **Restart:** `pm2 restart FiotaBot`
### 6. Verify: `pm2 logs FiotaBot` (Watch for "Ready! Logged in as..." message).

### 🛡️ Server Auditing
The audit is now **automated** to run every Monday at 9 AM. 
1.  **Security:** No dangerous permissions leaked to `@everyone`.
2.  **Structure:** All required Forums (e.g., `#lions-den`) and Tags exist.
3.  **Roles:** Essential roles like `Line Committee` haven't been deleted.
*Note: You can adjust the schedule in the `.env` file using the `AUDIT_CRON_SCHEDULE` variable (Standard Cron format).*

### 🚑 The "Bot is Dead" Checklist
If the bot isn't responding:
1.  **Check Process:** Run `pm2 status`. Is status `online` or `errored`?
2.  **Check Logs:** Run `pm2 logs FiotaBot --lines 50`. Look for "Error" in red.
3.  **Restart:** `pm2 restart FiotaBot` usually fixes memory leaks or stuck states.
4.  **Check Disk Space:** `df -h`. If drive is full, clear logs (`pm2 flush`).

---

## 3. Database Management (CRITICAL)
FiotaBot uses **SQLite** (`fiota.db`). This is a *single file*. If this file is deleted, **ALL VERIFICATION DATA IS LOST.**

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

## 4. n8n Automation (Weekly Digest)
*   **Access:** `http://<server_ip>:5678`
*   **Credential Expiry:** Microsoft Outlook tokens expire periodically.
    *   **Fix:** Log into n8n > Credentials > Outlook > Re-connect.
*   **Gemini Quota:** If "Did You Know" stops posting, check Google Cloud Console for API quota limits.

---

## 5. Security Protocols
*   **New Tech Chair Transition:**
    1.  Rotate the **Discord Bot Token** in Developer Portal.
    2.  Rotate **Hostinger SSH Keys/Password**.
    3.  Update `.env` on the server with new token.
    4.  Restart Bot.
*   **Spam Attack:**
    1.  Bot is getting spammed with fake verifications?
    2.  Temporarily disable the `/verify` command permissions in Discord Server Settings > Integrations.

---
**Maintained by Gamma Pi Tech Chair**
