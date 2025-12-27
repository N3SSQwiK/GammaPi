# FiotaBot Technical Specification

**Version:** 1.0
**Target Platform:** Discord (Bot), Hostinger (VPS)
**Language:** Node.js (TypeScript recommended) or Python
**Database:** SQLite (local on Hostinger) or JSON (for MVP)

## 1. System Overview
FiotaBot is the central operational bot for the Gamma Pi (Graduate) Chapter. Its primary function is **Identity Management** (Verification) and **Chapter Operations** (Voting, Attendance). It acts as the bridge between Discord, the Public (LinkedIn), and Internal Brotherhood.

## 2. Core Modules

### 2.1 Access Control Module (The Gatekeeper)
*   **Trigger:** User joins the server -> Lands in `#welcome-gate`.
*   **UI:** Embed with two buttons: `[🦁 Brother Verification]` and `[👔 Guest/Interest Access]`.

#### Feature A: Dual-Voucher System (Brothers)
1.  **Input:** Modal Form.
    *   Fields: `Full Name`, `Chapter of Initiation`, `Induction Year`, `Voucher Name`, `Zip Code`, `Industry`, `Job Title`.
2.  **Process:**
    *   Bot resolves Zip Code -> City/State/Timezone.
    *   Bot posts "Verification Ticket" to `#pending-verifications` (Admin Only).
    *   Embed status: `🔴 Pending (0/2)`.

#### Feature B: LinkedIn OAuth (Guests/Interests)
1.  **Input:** User clicks button.
2.  **Process:**
    *   Bot generates a unique URL: `https://gammapi.hostinger-url.com/auth/linkedin?user_id=12345`.
    *   User logs in on LinkedIn.
    *   Server callback receives `access_token` and fetches Profile Data (Name, Headline).
3.  **Validation:**
    *   Check: Account age > 30 days (if available) or existing connections > 10.
4.  **Output:**
    *   Bot renames user on Discord to `Real Name (Industry)`.
    *   User gets `Guest` role.

#### Feature C: Professional Search (Rolodex)
*   **Command:** `/find [industry] [city]`
*   **Action:** Queries the database.
*   **Output:** Returns a list of brothers matching criteria.
    *   Example: "Found 2 Brothers in 'Finance': @Nexus (NYC), @John (Chicago)."

#### Feature D: Mentorship Toggle
*   **Command:** `/mentor [status: On/Off]`
*   **Action:** Toggles the `is_mentor` flag and assigns/removes the `🧠 Open to Mentor` role.

### 2.2 Chapter Meeting Module
*   **Command:** `/attendance [duration_minutes]`
    *   **Action:** Creates a button in current channel `[Check In]`.
    *   **Logic:** Users click button. Bot records UserID + Timestamp.
    *   **Output:** At end of timer, generates a `.csv` file of attendees for the Secretary.
*   **Command:** `/vote [topic] [options]`
    *   **Action:** Formal poll embed.
    *   **Logic:** Single vote per user. Anonymous or Public (configurable).
    *   **Output:** Results graph.

### 2.3 Onboarding Module (Interests)
*   **Command:** `/progress [module_id]`
    *   **Action:** Updates user's progress in a local DB.
    *   **Logic:** If `History_Module` = Complete, unlock `#history-channel`.

## 3. Data Structure (Schema)

### Table: Users
| Field | Type | Description |
| :--- | :--- | :--- |
| `discord_id` | String (PK) | Unique Discord ID |
| `real_name` | String | From Verification or LinkedIn |
| `status` | Enum | `GUEST`, `BROTHER`, `OFFICER` |
| `linked_in_id` | String | Unique LinkedIn ID (for anti-duplicate) |
| `vouched_by` | JSON | `["brother_id_1", "brother_id_2"]` |
| `zip_code` | String | 5-digit Zip |
| `location_meta` | JSON | `{ city: "NY", state: "NY", tz: "EST" }` |
| `industry` | String | e.g. "Tech", "Finance" |
| `job_title` | String | e.g. "Senior Engineer" |
| `is_mentor` | Boolean | True/False |

### Table: Attendance
| Field | Type | Description |
| :--- | :--- | :--- |
| `meeting_id` | AutoInc | Unique Meeting ID |
| `date` | Date | Meeting Date |
| `attendees` | JSON | List of Discord IDs |

## 4. Infrastructure & Security
*   **Hosting:** Hostinger VPS (Ubuntu/Debian).
*   **Process Manager:** PM2 (to keep bot alive).
*   **Secrets Management:** `.env` file for Discord Token, LinkedIn Client ID/Secret.
*   **Backup:** SQLite database file backed up nightly via cron to a separate folder.

## 5. External API Requirements
1.  **Discord API:** Bot Token, Intents (Guild Members, Message Content).
2.  **LinkedIn API:** "Sign In with LinkedIn" Product enabled in Developer Portal.
