# FiotaBot Technical Specification

**Version:** 1.1
**Target Platform:** Discord (Bot), Hostinger (VPS)
**Language:** Node.js (TypeScript)
**Database:** SQLite (local on Hostinger via `better-sqlite3`)

## 1. System Overview
FiotaBot is the central operational bot for the Gamma Pi (Graduate) Chapter. Its primary function is **Identity Management** (Verification) and **Chapter Operations** (Voting, Attendance). It acts as the bridge between Discord, the Public (LinkedIn), and Internal Brotherhood.

## 2. Core Modules

### 2.1 Access Control Module (The Gatekeeper)

#### Feature 0: Rules Agreement (Prerequisite)
1.  **Trigger:** User joins the server -> Lands in `#rules-and-conduct`.
2.  **UI:** Code of Conduct embed with sections: Respect & Dignity, Professionalism, Prohibited Behavior, Enforcement.
3.  **Process:**
    *   User clicks `[✅ I Agree to the Code of Conduct]` button.
    *   Bot records `rules_agreed_at` timestamp in database.
    *   Bot grants `✅ Rules Accepted` role.
    *   User can now access `#welcome-gate`.
4.  **Command:** `/rules` (Admin only) - Posts the Code of Conduct embed.

#### Verification Gate
*   **Trigger:** User with `✅ Rules Accepted` role -> Accesses `#welcome-gate`.
*   **UI:** Embed with two buttons: `[🦁 Brother Verification]` and `[🌍 Guest Access]` with clear explanations of requirements and benefits for each path.

#### Feature A: Dual-Voucher System (Brothers)
1.  **Input:** Modal Form.
    *   Fields: `Full Name`, `Chapter of Initiation`, `Induction Year`, `Voucher Name`, `Zip Code`, `Industry`, `Job Title`.
2.  **Process:**
    *   Bot resolves Zip Code -> City/State/Timezone.
    *   Bot posts "Verification Ticket" to `#pending-verifications` (Configurable via `VERIFICATION_CHANNEL_ID`).
    *   Embed status: `🔴 Pending (0/2)`.
    *   **Transactions:** Approval logic uses DB transactions to prevent race conditions.
    *   **Role Grant:** Upon 2/2 approvals, user is granted the `🦁 ΓΠ Brother` role.

#### Feature B: LinkedIn OAuth (Guests/Interests)
1.  **Input:** User clicks button.
2.  **Process:**
    *   Bot generates a unique URL: `https://gammapi.hostinger-url.com/auth/linkedin?user_id=12345`.
    *   User logs in on LinkedIn.
    *   Server callback receives `access_token` and fetches Profile Data.
3.  **Output:** Bot renames user on Discord to `Real Name (Industry)` and grants `Guest` role.

#### Feature C: Professional Search (Rolodex)
*   **Command:** `/find [industry]`
*   **Action:** Queries the database using parameterized SQL.
*   **Output:** Returns a list of brothers matching criteria.

#### Feature D: Mentorship Toggle
*   **Command:** `/mentor [status: On/Off]`
*   **Action:** Toggles the `is_mentor` flag and assigns/removes the `🧠 Open to Mentor` role.

### 2.2 Chapter Meeting Module
*   **Command:** `/attendance [duration_minutes]`
    *   **Action:** Creates a button in current channel `[Check In]`.
    *   **Logic:** Users click button. Bot records UserID in the persistent `attendance` table.
*   **Command:** `/vote [topic]`
    *   **Action:** Formal poll embed with **Yes/No/Abstain Buttons**.
    *   **Logic:** Single vote per user. Votes are persisted to the database (survive bot restarts).

### 2.3 Onboarding Module (Interests)
*   **Command:** `/pipeline [user] [status]`
    *   **Action:** Updates a candidate's position in the intake funnel (Applied, Interview, Decision).
    *   **Visibility:** Syncs with the "Line Committee" permissions to control opacity.

### 2.4 Audit & Compliance Module
*   **Command:** `/audit`
    *   **Action:** Scans server Role/Channel/Permission structure.
    *   **Logic:** Compares `interaction.guild` state against a hardcoded "Golden Config".
    *   **Output:** Embed Report (Pass/Fail) with description truncation at 4000 characters.

### 2.5 Scheduler Module (Automation)
*   **Technology:** `node-cron`
*   **Task A: Weekly Audit:** Runs every Monday at 9:00 AM. Executes the Audit logic and posts the report to `AUDIT_CHANNEL_ID`.

## 3. Data Structure (Schema)

### Table: Users
| Field | Type | Description |
| :--- | :--- | :--- |
| `discord_id` | String (PK) | Unique Discord ID |
| `real_name` | String | From Verification or LinkedIn |
| `status` | Enum | `GUEST`, `BROTHER`, `OFFICER` |
| `zip_code` | String | 5-digit Zip |
| `location_meta` | JSON String | Derived city/state/timezone |
| `industry` | String | e.g. "Technology / Software" |
| `job_title` | String | e.g. "Senior Engineer" |
| `is_mentor` | Integer | 1 (True) or 0 (False) |
| `linked_in_id` | String | LinkedIn profile URL (optional) |
| `vouched_by` | JSON String | Array of voucher Discord IDs |
| `rules_agreed_at` | String | ISO timestamp of Code of Conduct agreement |

### 📋 Pending Schema Additions (See `openspec/changes/enhance-verification-ux`)

The following fields are proposed and will be added when the Enhanced Verification UX proposal is implemented:

| Field | Type | Description |
| :--- | :--- | :--- |
| `first_name` | String | First name (split from real_name) |
| `middle_name` | String | Middle name (optional) |
| `last_name` | String | Last name (split from real_name) |
| `don_name` | String | Fraternity nickname (e.g., "Phoenix") |
| `phone_number` | String | Contact phone (international format) |
| `chapter` | String | Chapter designation (e.g., "Gamma Pi") |
| `initiation_year` | Integer | Year of crossing (1931-2029) |
| `initiation_semester` | String | "Spring" or "Fall" |
| `city` | String | City (derived from zip or international) |
| `state_province` | String | State/Province |
| `country` | String | Country (default: "United States") |

**Display Name Priority:** When `don_name` is set, displays as "Don {don_name} ({first_name} {last_name})"

### Table: Attendance
| Field | Type | Description |
| :--- | :--- | :--- |
| `meeting_id` | AutoInc | Unique Meeting ID |
| `date` | Date | Meeting Date |
| `topic` | String | Meeting Topic |
| `attendees` | JSON String | List of Discord IDs |

### Table: Votes (Persistence)
| Field | Type | Description |
| :--- | :--- | :--- |
| `poll_id` | String | Discord Message ID of the poll |
| `user_id` | String | Discord ID of the voter |
| `choice` | String | `vote_yes`, `vote_no`, `vote_abstain` |
| **PK** | `(poll_id, user_id)` | Primary Key |

### Table: Verification Tickets
| Field | Type | Description |
| :--- | :--- | :--- |
| `ticket_id` | String (PK) | Internal ID |
| `user_id` | String | Applicant ID |
| `voucher_1` | String | ID of first brother |
| `voucher_2` | String | ID of second brother |
| `status` | String | `PENDING`, `PENDING_2`, `VERIFIED` |

## 4. Infrastructure & Security
*   **Hosting:** Hostinger VPS (Ubuntu/Debian).
*   **Process Manager:** PM2 (to keep bot alive).
*   **Logging:** Winston structured logging (`logs/combined.log` and `logs/error.log`).
*   **Startup:** All commands/events loaded asynchronously before Discord login.
*   **Graceful Shutdown:** Handles `SIGINT` to close DB connections and cleanup.

## 5. External API Requirements
1.  **Discord API:** Bot Token, Intents (Guild Members, Message Content).
2.  **LinkedIn API:** "Sign In with LinkedIn" Product enabled in Developer Portal.

---
**Semper Parati, Semper Juncti.**
