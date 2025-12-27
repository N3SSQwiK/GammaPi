import db from '../db';

export interface UserRow {
    discord_id: string;
    real_name: string | null;
    status: 'GUEST' | 'BROTHER' | 'OFFICER';
    linked_in_id: string | null;
    vouched_by: string | null;
    zip_code: string | null;
    location_meta: string | null;
    industry: string | null;
    job_title: string | null;
    is_mentor: number;
}

export const userRepository = {
    getByDiscordId(discordId: string): UserRow | undefined {
        return db.prepare('SELECT * FROM users WHERE discord_id = ?').get(discordId) as UserRow | undefined;
    },

    upsert(user: Partial<UserRow>): void {
        const columns = Object.keys(user);
        const placeholders = columns.map(() => '?').join(', ');
        const updates = columns.map(col => `${col} = EXCLUDED.${col}`).join(', ');
        
        const sql = `
            INSERT INTO users (${columns.join(', ')})
            VALUES (${placeholders})
            ON CONFLICT(discord_id) DO UPDATE SET ${updates}
        `;
        
        db.prepare(sql).run(...Object.values(user));
    },

    updateStatus(discordId: string, status: 'GUEST' | 'BROTHER' | 'OFFICER'): void {
        db.prepare('UPDATE users SET status = ? WHERE discord_id = ?').run(status, discordId);
    },

    updateMentorship(discordId: string, isMentor: boolean): void {
        db.prepare('UPDATE users SET is_mentor = ? WHERE discord_id = ?').run(isMentor ? 1 : 0, discordId);
    },

    findBrothersByIndustry(industry: string): UserRow[] {
        return db.prepare('SELECT * FROM users WHERE status = "BROTHER" AND industry LIKE ?').all(`%${industry}%`) as UserRow[];
    }
};
