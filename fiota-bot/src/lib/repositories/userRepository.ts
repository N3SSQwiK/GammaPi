import db from '../db';
import { VoucherSearchResult, calculateNameMatchScore, parseVoucherSearch } from '../validation';

export interface UserRow {
    discord_id: string;
    // Name fields
    first_name: string | null;
    last_name: string | null;
    don_name: string | null;
    real_name: string | null; // Generated column: TRIM(first_name || ' ' || last_name)
    // Status & verification
    status: 'GUEST' | 'BROTHER';
    rules_agreed_at: string | null;
    // Chapter & initiation
    chapter: string | null;
    initiation_year: number | null;
    initiation_semester: 'Spring' | 'Fall' | null;
    // Contact
    phone_number: string | null;
    // Location
    zip_code: string | null;
    city: string | null;
    state_province: string | null;
    country: string | null;
    location_meta: string | null;
    // Professional
    industry: string | null;
    job_title: string | null;
    // Networking
    linked_in_id: string | null;
    is_mentor: number;
}

// Valid columns for upsert operations
const VALID_COLUMNS = [
    'discord_id',
    'first_name', 'last_name', 'don_name',
    'status', 'rules_agreed_at',
    'chapter', 'initiation_year', 'initiation_semester',
    'phone_number',
    'zip_code', 'city', 'state_province', 'country', 'location_meta',
    'industry', 'job_title',
    'linked_in_id', 'is_mentor'
];

export const userRepository = {
    getByDiscordId(discordId: string): UserRow | undefined {
        return db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId) as UserRow | undefined;
    },

    upsert(user: Partial<UserRow>): void {
        const columns = Object.keys(user).filter(col => VALID_COLUMNS.includes(col));

        if (columns.length === 0) return;

        const placeholders = columns.map(() => '?').join(', ');
        const updates = columns.map(col => `${col} = EXCLUDED.${col}`).join(', ');

        const sql = `
            INSERT INTO users (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT(discord_id) DO UPDATE SET ${updates}
        `;

        const values = columns.map(col => (user as any)[col]);
        db.prepare(sql).run(...values);
    },

    updateStatus(discordId: string, status: 'GUEST' | 'BROTHER'): void {
        db.prepare('UPDATE users SET status = ? WHERE discord_id = ?').run(status, discordId);
    },

    updateMentorship(discordId: string, isMentor: boolean): void {
        db.prepare('UPDATE users SET is_mentor = ? WHERE discord_id = ?').run(isMentor ? 1 : 0, discordId);
    },

    updateChapter(discordId: string, chapter: string): void {
        db.prepare('UPDATE users SET chapter = ? WHERE discord_id = ?').run(chapter, discordId);
    },

    /**
     * Find brothers by industry (for /find command)
     */
    findBrothersByIndustry(industry: string): UserRow[] {
        const conditions: string[] = ['status = ?'];
        const params: any[] = ['BROTHER'];

        if (industry) {
            conditions.push('industry LIKE ?');
            params.push(`%${industry}%`);
        }

        const sql = `SELECT * FROM users WHERE ${conditions.join(' AND ')}`;
        return db.prepare(sql).all(...params) as UserRow[];
    },

    /**
     * Search brothers by name (for voucher selection)
     * Searches don_name, first_name, last_name, and real_name (for legacy records)
     * Returns top matches sorted by relevance
     */
    searchBrothersByName(query: string, limit = 10): VoucherSearchResult[] {
        const { terms } = parseVoucherSearch(query);

        if (terms.length === 0) {
            return [];
        }

        // Get Gamma Pi brothers with names
        // Only Gamma Pi brothers can vouch since this is a Gamma Pi Discord server
        const brothers = db.prepare(`
            SELECT discord_id, first_name, last_name, don_name
            FROM users
            WHERE status = 'BROTHER'
            AND chapter = 'gamma-pi'
            AND first_name IS NOT NULL
            AND last_name IS NOT NULL
        `).all() as Array<{
            discord_id: string;
            first_name: string;
            last_name: string;
            don_name: string | null;
        }>;

        // Calculate match scores and filter
        const results: Array<VoucherSearchResult & { score: number }> = [];

        for (const bro of brothers) {
            const candidate: VoucherSearchResult = {
                discord_id: bro.discord_id,
                first_name: bro.first_name,
                last_name: bro.last_name,
                don_name: bro.don_name,
                display_name: bro.don_name
                    ? `Don ${bro.don_name} (${bro.first_name} ${bro.last_name})`
                    : `${bro.first_name} ${bro.last_name}`
            };

            const score = calculateNameMatchScore(terms, candidate);
            if (score > 0) {
                results.push({ ...candidate, score });
            }
        }

        // Sort by score (highest first) and limit
        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(({ score, ...rest }) => rest);
    },

    /**
     * Get Gamma Pi brother by Discord ID for voucher validation
     * Only Gamma Pi brothers can be vouchers since this is a Gamma Pi Discord server
     */
    getBrotherForVoucher(discordId: string): VoucherSearchResult | null {
        const user = db.prepare(`
            SELECT discord_id, first_name, last_name, don_name
            FROM users
            WHERE discord_id = ? AND status = 'BROTHER' AND chapter = 'gamma-pi'
            AND first_name IS NOT NULL AND last_name IS NOT NULL
        `).get(discordId) as {
            discord_id: string;
            first_name: string;
            last_name: string;
            don_name: string | null;
        } | undefined;

        if (!user) {
            return null;
        }

        return {
            discord_id: user.discord_id,
            first_name: user.first_name,
            last_name: user.last_name,
            don_name: user.don_name,
            display_name: user.don_name
                ? `Don ${user.don_name} (${user.first_name} ${user.last_name})`
                : `${user.first_name} ${user.last_name}`
        };
    },

    /**
     * Get all brothers (for autocomplete and listing)
     */
    getAllBrothers(): UserRow[] {
        return db.prepare(`
            SELECT * FROM users
            WHERE status = 'BROTHER'
            ORDER BY last_name, first_name
        `).all() as UserRow[];
    },

    /**
     * Count total brothers in database (for bootstrap threshold check)
     * Used to disable bootstrap command once 2+ brothers exist
     */
    countBrothers(): number {
        const result = db.prepare(
            'SELECT COUNT(*) as count FROM users WHERE status = ?'
        ).get('BROTHER') as { count: number };
        return result.count;
    },

    recordRulesAgreement(discordId: string): void {
        const timestamp = new Date().toISOString();
        db.prepare(`
            INSERT INTO users (discord_id, rules_agreed_at)
            VALUES (?, ?)
            ON CONFLICT(discord_id) DO UPDATE SET rules_agreed_at = EXCLUDED.rules_agreed_at
        `).run(discordId, timestamp);
    },

    hasAgreedToRules(discordId: string): boolean {
        const user = this.getByDiscordId(discordId);
        return user?.rules_agreed_at !== null && user?.rules_agreed_at !== undefined;
    },

    /**
     * Get full name for display
     * Uses the real_name generated column (computed from first_name + last_name)
     */
    getFullName(user: UserRow): string {
        // real_name is a generated column: TRIM(first_name || ' ' || last_name)
        if (user.real_name && user.real_name.trim()) {
            return user.real_name;
        }
        return 'Unknown';
    }
};
