import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../fiota.db');
const db = new Database(dbPath, { verbose: console.log });

// Helper to safely add column if it doesn't exist
const addColumnIfNotExists = (table: string, column: string, definition: string) => {
    try {
        db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`[DB Migration] Added column ${table}.${column}`);
    } catch (e) {
        // Column already exists, ignore
    }
};

// Initialize Schema
const initDb = () => {
    // Users Table - Enhanced for Phase 2 verification flow
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            discord_id TEXT PRIMARY KEY,
            -- Name fields
            first_name TEXT,
            last_name TEXT,
            don_name TEXT,
            real_name TEXT,  -- Legacy field, kept for backward compatibility with pre-Phase2 records
            -- Status & verification
            status TEXT CHECK(status IN ('GUEST', 'BROTHER')) DEFAULT 'GUEST',
            rules_agreed_at TEXT,
            -- Chapter & initiation
            chapter TEXT,
            initiation_year INTEGER,
            initiation_semester TEXT CHECK(initiation_semester IN ('Spring', 'Fall')),
            -- Contact info
            phone_number TEXT,
            -- Location
            zip_code TEXT,
            city TEXT,
            state_province TEXT,
            country TEXT DEFAULT 'United States',
            location_meta TEXT,
            -- Professional
            industry TEXT,
            job_title TEXT,
            -- Networking
            linked_in_id TEXT,
            is_mentor INTEGER DEFAULT 0
        )
    `);

    // Phase 2 migrations for existing databases
    // Name fields
    addColumnIfNotExists('users', 'first_name', 'TEXT');
    addColumnIfNotExists('users', 'last_name', 'TEXT');
    addColumnIfNotExists('users', 'don_name', 'TEXT');
    // Chapter & initiation
    addColumnIfNotExists('users', 'chapter', 'TEXT');
    addColumnIfNotExists('users', 'initiation_year', 'INTEGER');
    addColumnIfNotExists('users', 'initiation_semester', 'TEXT');
    // Contact
    addColumnIfNotExists('users', 'phone_number', 'TEXT');
    // Location
    addColumnIfNotExists('users', 'city', 'TEXT');
    addColumnIfNotExists('users', 'state_province', 'TEXT');
    addColumnIfNotExists('users', 'country', "TEXT DEFAULT 'United States'");
    // Legacy column migration (rules_agreed_at may already exist)
    addColumnIfNotExists('users', 'rules_agreed_at', 'TEXT');

    // Attendance Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS attendance (
            meeting_id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            topic TEXT,
            attendees TEXT -- JSON array of discord_ids
        )
    `);

    // Verification Tickets Table - Enhanced for named voucher system
    db.exec(`
        CREATE TABLE IF NOT EXISTS verification_tickets (
            ticket_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            -- Named vouchers (Discord IDs of brothers who must approve)
            named_voucher_1 TEXT,
            named_voucher_2 TEXT,
            -- Actual approvers (Discord IDs of who clicked approve)
            voucher_1 TEXT,
            voucher_2 TEXT,
            -- Timestamps for 48hr fallback logic
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            voucher_1_at TEXT,
            voucher_2_at TEXT,
            -- Status: PENDING, PENDING_2 (1 approval), VERIFIED, EXPIRED, OVERRIDDEN
            status TEXT DEFAULT 'PENDING'
        )
    `);

    // Verification tickets migrations for existing databases
    addColumnIfNotExists('verification_tickets', 'named_voucher_1', 'TEXT');
    addColumnIfNotExists('verification_tickets', 'named_voucher_2', 'TEXT');
    addColumnIfNotExists('verification_tickets', 'created_at', "TEXT DEFAULT (datetime('now'))");
    addColumnIfNotExists('verification_tickets', 'voucher_1_at', 'TEXT');
    addColumnIfNotExists('verification_tickets', 'voucher_2_at', 'TEXT');

    // Votes Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS votes (
            poll_id TEXT,
            user_id TEXT,
            choice TEXT,
            PRIMARY KEY (poll_id, user_id)
        )
    `);

    console.log('[DB] Database initialized with Phase 2 schema');
};

export default db;
export { initDb };
