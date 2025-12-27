import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../fiota.db');
const db = new Database(dbPath, { verbose: console.log });

// Initialize Schema
const initDb = () => {
    // Users Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            discord_id TEXT PRIMARY KEY,
            real_name TEXT,
            status TEXT CHECK(status IN ('GUEST', 'BROTHER', 'OFFICER')) DEFAULT 'GUEST',
            linked_in_id TEXT,
            vouched_by TEXT, -- JSON array
            zip_code TEXT,
            location_meta TEXT, -- JSON object {city, state, tz}
            industry TEXT,
            job_title TEXT,
            is_mentor INTEGER DEFAULT 0 -- Boolean
        )
    `);

    // Attendance Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS attendance (
            meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            topic TEXT,
            attendees TEXT -- JSON array of discord_ids
        )
    `);

    // Verification Tickets Table (To track the 2-vote system state)
    db.exec(`
        CREATE TABLE IF NOT EXISTS verification_tickets (
            ticket_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            voucher_1 TEXT,
            voucher_2 TEXT,
            status TEXT DEFAULT 'PENDING'
        )
    `);

    // Votes Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS votes (
            poll_id TEXT,
            user_id TEXT,
            choice TEXT,
            PRIMARY KEY (poll_id, user_id)
        )
    `);
    
    console.log('Database initialized');
};

export default db;
export { initDb };
