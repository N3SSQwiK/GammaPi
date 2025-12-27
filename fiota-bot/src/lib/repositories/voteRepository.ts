import db from '../db';

export interface VoteRow {
    poll_id: string;
    user_id: string;
    choice: string;
}

export const voteRepository = {
    saveVote(pollId: string, userId: string, choice: string): void {
        db.prepare(`
            INSERT INTO votes (poll_id, user_id, choice)
            VALUES (?, ?, ?)
            ON CONFLICT(poll_id, user_id) DO UPDATE SET choice = EXCLUDED.choice
        `).run(pollId, userId, choice);
    },

    getCounts(pollId: string): { yes: number, no: number, abstain: number } {
        const rows = db.prepare('SELECT choice, COUNT(*) as count FROM votes WHERE poll_id = ? GROUP BY choice').all(pollId) as any[];
        
        const counts = { yes: 0, no: 0, abstain: 0 };
        rows.forEach(row => {
            if (row.choice === 'vote_yes') counts.yes = row.count;
            if (row.choice === 'vote_no') counts.no = row.count;
            if (row.choice === 'vote_abstain') counts.abstain = row.count;
        });
        
        return counts;
    }
};
