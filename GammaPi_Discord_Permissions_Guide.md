# Gamma Pi Discord Permission Standards

**Version:** 1.0
**Context:** This document defines the server-level permissions for the Gamma Pi (Phi Iota Alpha) Discord server. It aligns with the **Role-Based Access Control (RBAC)** strategy outlined in the Migration Report.

## 1. Permission Philosophy & Rationale

The security model depends on **"Least Privilege"**: users should only have the permissions necessary to fulfill their role. This prevents accidents (e.g., deleting a channel) and reduces "notification fatigue" (e.g., abusing `@everyone`).

### Key Strategies
*   **The Baseline (@everyone):** We strip almost all permissions from the default `@everyone` role. This ensures that unverified users (Guests) cannot disrupt the server.
*   **Noise Control:** Only **E-Board** can use "Mention @everyone/here". This preserves the sanctity of the notification ping.
*   **Safety:** Only **E-Board** and **Line Committee** can Manage Messages (delete) or Kick/Ban.
*   **Engagement:** All "Brother" roles (Active, Visiting, Alumni) are encouraged to use "Add Reactions" and "External Emojis" to foster a fun culture.

---

## 2. Role vs. Permission Matrix

**Legend:**
*   ✅ = **Granted** (Server-Wide)
*   ❌ = **Denied**
*   🔸 = **Channel Specific** (Granted only in specific categories via overrides)

| Permission Category | Permission Flag | 🦁 E-Board | 🦁 Line Comm. | 🦁 ΓΠ Brother | 🦁 Visiting | 🦁 Alumni | 👔 Candidate | 🌍 Guest |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
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
| | Mute/Deafen Others| ✅ | 🔸 | ❌ | ❌ | ❌ | ❌ | ❌ |
| | Move Members | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Detailed Role Definitions

### 🦁 E-Board (Administrator)
*   **Rationale:** These users manage the infrastructure.
*   **Critical Permissions:** `Administrator`. This bypasses all channel restrictions.
*   **Responsibility:** Only the Chapter President, Secretary, and Tech Chair should hold this.

### 🦁 Line Committee
*   **Rationale:** Needs to manage the intake process flow without seeing sensitive E-Board channels (Treasury).
*   **Special Permissions:**
    *   `Manage Nicknames`: To standardize Candidate names (e.g., "Cdt. John Doe").
    *   `Move Members`: To drag candidates from a "Waiting Room" voice channel into an "Interview Room".
    *   `Priority Speaker`: Useful during interview debriefs to control the floor.

### 🦁 ΓΠ Brother
*   **Rationale:** The core user. Needs full social capability but no destructive power.
*   **Key Settings:**
    *   `Create Invite`: Allowed. We want them to invite lost brothers.
    *   `Attach Files`: Allowed. For sharing resumes or meeting docs.
    *   `Mention @everyone`: **DENIED**. Prevents accidental server-wide pings.

### 🦁 Visiting Brother (Active) & 🦁 Brother at Large (Alumni)
*   **Rationale:** Guests in our house. We treat them with respect (Social features) but protect our integrity.
*   **Key Settings:**
    *   `Create Invite`: **DENIED**. They should not be inviting randoms to our server; that is a ΓΠ Brother privilege.
    *   `Change Nickname`: Allowed. They can correct their own name.

### 👔 Candidate / Interest
*   **Rationale:** Under evaluation. Access is tightly controlled.
*   **Key Settings:**
    *   `View Channels`: **DENIED** globally. They rely on "Channel Overrides" (specific permission to see `#welcome-gate` or `#onboarding`) to see anything.
    *   `Change Nickname`: **DENIED**. The Line Committee controls their identity during the process.
    *   `Attach Files`: **Granted via Channel Override only** (in `#document-submission` channels), but denied server-wide to prevent spam.

### 🌍 Guest / Public
*   **Rationale:** Verified humans (via LinkedIn) but not members.
*   **Key Settings:**
    *   `Send Messages`: **DENIED** globally, except in `#public-chat`.
    *   `Read Message History`: Allowed. They can see announcements.

---

## 4. Channel Overrides (The Real Security)
Server permissions set the *maximum* ability, but Channel Overrides dictate *where* abilities can be used.

### Category: 🗳️ E-BOARD
*   **@everyone:** `View Channel: ❌`
*   **🦁 E-Board:** `View Channel: ✅`

### Category: 🦁 CHAPTER OPS (Treasury, Minutes)
*   **@everyone:** `View Channel: ❌`
*   **🦁 ΓΠ Brother:** `View Channel: ✅`, `Send Messages: ✅`
*   **🦁 Visiting / Alumni:** `View Channel: ❌` (Strict financial privacy)

### Category: 📚 ONBOARDING (Interview Rooms)
*   **@everyone:** `View Channel: ❌`
*   **🦁 Line Committee:** `View Channel: ✅`, `Manage Messages: ✅` (To clean up chat), `Connect: ✅`
*   **👔 Candidate:** `View Channel: ✅` (Only specific channels), `Connect: ✅`
*   **🦁 Gamma Pi Active:** `View Channel: ❌` (Opacity control - they cannot see interview notes)

### Category: 📣 PUBLIC INFO
*   **@everyone:** `View Channel: ✅`, `Send Messages: ❌`, `Add Reactions: ✅`
*   **🦁 E-Board:** `Send Messages: ✅` (Only Admins announce)

---

## 5. Setup Guide for Tech Chair
1.  **Create Roles first:** Go to Server Settings > Roles. Create them in the order listed above (Highest rank at the top).
2.  **Strip @everyone:** Select `@everyone` and turn **OFF** `Send Messages`, `View Channels` (depending on preference, usually better to leave View on but hide specific Categories), and `Create Invite`.
3.  **Apply Server Perms:** Go through each role and toggle the flags per the Matrix in Section 2.
4.  **Setup Categories:** Create your Categories (`E-BOARD`, `CHAPTER OPS`, etc.) and set the permissions on the **Category** itself. Toggle "Sync Permissions" for channels inside them.
