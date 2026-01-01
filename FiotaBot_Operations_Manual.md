# FiotaBot Operations Manual

**Document Version:** 3.0
**Last Updated:** January 2026
**Audience:** Chapter Administrators, Tech Chairs, E-Board

---

## Quick Reference

| I need to... | Go to... |
|--------------|----------|
| Set up the bot for the first time | [Part 1: Initial Setup](#part-1-initial-setup) |
| Verify a new brother | [Section 2.2](#22-verification-flow) |
| Take meeting attendance | [Section 2.3](#23-attendance) |
| Update the bot after code changes | [Section 3.1](#31-updating-the-bot) |
| Fix a broken bot | [Section 3.6](#36-troubleshooting) |
| Export data for reports | [Section 3.4](#34-data-export-for-reporting) |
| Back up the database | [Section 3.3](#33-database-backups) |
| Onboard a new Tech Chair | [Section 4.2](#42-tech-chair-transition) |

---

# Part 1: Initial Setup

*Complete this section once when first deploying FiotaBot.*

## 1.1 Discord Developer Portal Setup

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

## 1.2 VPS (Hostinger) Preparation

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

## 1.3 Deploy the Bot

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

## 1.4 Fresh Server Bootstrap

*Complete these steps on a brand new Discord server.*

### Step 1: Create Server Structure
```
/setup
```
Bot creates all required roles and channels (Golden State).

### Step 2: Bootstrap First Brothers
**Problem:** Verification requires 2 brothers to approve, but a fresh install has none.

**Solution:** Server owner uses `/bootstrap`:
1. Run `/bootstrap` — fills out modal with name, chapter, initiation info
2. Owner becomes first brother with 🦁 ΓΠ Brother role
3. Have a second founding brother join and run `/bootstrap`
4. `/bootstrap` auto-disables after 2 brothers exist

### Step 3: Set Up Onboarding
1. Go to `#rules-and-conduct` → Run `/rules`
2. Go to `#welcome-gate` → Run `/verify`

### Step 4: Configure Permissions
| Channel | Visible To |
|---------|------------|
| `#rules-and-conduct` | @everyone |
| `#welcome-gate` | ✅ Rules Accepted |
| All other channels | 🦁 ΓΠ Brother, 🦁 Visiting Brother |

---

# Part 2: Daily Operations

*Reference this section for day-to-day chapter activities.*

## 2.1 Command Reference

| Command | Permission | Description |
|---------|------------|-------------|
| `/setup` | Admin | Create missing roles/channels |
| `/bootstrap` | Server Owner | Seed first brothers (fresh install only) |
| `/rules` | Admin | Post Code of Conduct embed |
| `/verify` | Admin | Post verification gate embed |
| `/verify-start` | Everyone | Start multi-step verification |
| `/verify-override` | E-Board | Override a pending ticket |
| `/chapter-assign` | E-Board | Assign chapter to brother |
| `/profile-update` | Everyone | Update your profile |
| `/find` | Everyone | Search brother directory |
| `/mentor` | Everyone | Toggle mentorship availability |
| `/attendance` | Admin | Start attendance check-in |
| `/audit` | Admin | Run server security audit |

---

## 2.2 Verification Flow

### For New Members
1. **New member joins** → Lands in `#rules-and-conduct`
2. **Reads Code of Conduct** → Clicks **[✅ I Agree]**
   - *Bot grants `✅ Rules Accepted` role*
3. **Goes to `#welcome-gate`** → Runs `/verify-start`
   - Selects Chapter (80+ options with autocomplete)
   - Selects Industry (50 options with autocomplete)
4. **Step 1 Modal:** Identity info
   - First Name, Last Name, Don Name (optional)
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

## 2.3 Attendance

1. **Secretary** goes to `#meeting-attendance`
2. **Run:** `/attendance duration:15`
3. **Bot posts** green "Check In" button
4. **Brothers click** to check in
5. **After duration** → Bot closes attendance and saves to database

---

## 2.4 Security Audits

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

# Part 3: Maintenance

*Reference this section for ongoing system maintenance.*

## 3.1 Updating the Bot

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

## 3.2 Database Overview

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

## 3.3 Database Backups

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

## 3.4 Data Export for Reporting

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

## 3.5 Quarterly Maintenance

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

## 3.6 Troubleshooting

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

# Part 4: Advanced Administration

*Reference this section for security and advanced configuration.*

## 4.1 Security Protocols

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

## 4.2 Tech Chair Transition

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

## 4.3 Limited Operator Accounts

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

## 4.4 n8n Automation

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

## 4.5 Key Files Reference

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

4. Run `/setup` in Discord

---

**Maintained by Gamma Pi Tech Chair**
*Semper Parati, Semper Juncti.*
