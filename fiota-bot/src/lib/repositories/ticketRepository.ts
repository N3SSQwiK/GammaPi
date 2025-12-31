import db from '../db';

export interface TicketRow {
    ticket_id: string;
    user_id: string;
    // Named vouchers (the brothers the applicant specified)
    named_voucher_1: string | null;
    named_voucher_2: string | null;
    // Actual approvers (who clicked approve)
    voucher_1: string | null;
    voucher_2: string | null;
    // Timestamps
    created_at: string;
    voucher_1_at: string | null;
    voucher_2_at: string | null;
    // Status: PENDING, PENDING_2, VERIFIED, EXPIRED, OVERRIDDEN
    status: string;
}

export const ticketRepository = {
    getById(ticketId: string): TicketRow | undefined {
        return db.prepare('SELECT * FROM verification_tickets WHERE ticket_id = ?').get(ticketId) as TicketRow | undefined;
    },

    getByUserId(userId: string): TicketRow | undefined {
        return db.prepare(`
            SELECT * FROM verification_tickets
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 1
        `).get(userId) as TicketRow | undefined;
    },

    /**
     * Create a new verification ticket with named vouchers
     */
    create(ticketId: string, userId: string, namedVoucher1: string, namedVoucher2: string): void {
        const createdAt = new Date().toISOString();
        db.prepare(`
            INSERT INTO verification_tickets (ticket_id, user_id, named_voucher_1, named_voucher_2, created_at, status)
            VALUES (?, ?, ?, ?, ?, 'PENDING')
        `).run(ticketId, userId, namedVoucher1, namedVoucher2, createdAt);
    },

    /**
     * Check if a user can approve a ticket
     * - Any ΓΠ brother can approve any ticket
     * - Returns reason if not allowed
     */
    canApprove(ticket: TicketRow, approverId: string): { allowed: boolean; reason?: string } {
        // Already verified
        if (ticket.status === 'VERIFIED' || ticket.status === 'OVERRIDDEN') {
            return { allowed: false, reason: 'This ticket has already been verified.' };
        }

        // Check if this user already approved
        if (ticket.voucher_1 === approverId || ticket.voucher_2 === approverId) {
            return { allowed: false, reason: 'You have already approved this ticket.' };
        }

        // Any brother can approve
        return { allowed: true };
    },

    /**
     * Record first approval
     */
    recordFirstApproval(ticketId: string, approverId: string): void {
        const timestamp = new Date().toISOString();
        db.prepare(`
            UPDATE verification_tickets
            SET voucher_1 = ?, voucher_1_at = ?, status = 'PENDING_2'
            WHERE ticket_id = ?
        `).run(approverId, timestamp, ticketId);
    },

    /**
     * Record second approval (completes verification)
     */
    recordSecondApproval(ticketId: string, approverId: string): void {
        const timestamp = new Date().toISOString();
        db.prepare(`
            UPDATE verification_tickets
            SET voucher_2 = ?, voucher_2_at = ?, status = 'VERIFIED'
            WHERE ticket_id = ?
        `).run(approverId, timestamp, ticketId);
    },

    /**
     * E-Board override - immediately verify a ticket
     */
    override(ticketId: string, overriderId: string): void {
        const timestamp = new Date().toISOString();
        db.prepare(`
            UPDATE verification_tickets
            SET status = 'OVERRIDDEN', voucher_1 = ?, voucher_1_at = ?, voucher_2 = ?, voucher_2_at = ?
            WHERE ticket_id = ?
        `).run(overriderId, timestamp, overriderId, timestamp, ticketId);
    },

    /**
     * Get all pending tickets (for admin dashboard)
     */
    getPendingTickets(): TicketRow[] {
        return db.prepare(`
            SELECT * FROM verification_tickets
            WHERE status IN ('PENDING', 'PENDING_2')
            ORDER BY created_at ASC
        `).all() as TicketRow[];
    },

    /**
     * Get tickets waiting on a specific voucher
     */
    getTicketsForVoucher(voucherId: string): TicketRow[] {
        return db.prepare(`
            SELECT * FROM verification_tickets
            WHERE status IN ('PENDING', 'PENDING_2')
            AND (named_voucher_1 = ? OR named_voucher_2 = ?)
            AND voucher_1 != ? AND (voucher_2 IS NULL OR voucher_2 != ?)
            ORDER BY created_at ASC
        `).all(voucherId, voucherId, voucherId, voucherId) as TicketRow[];
    },

    /**
     * Legacy methods for backward compatibility
     */
    updateVoucher1(ticketId: string, voucher1: string): void {
        this.recordFirstApproval(ticketId, voucher1);
    },

    updateVoucher2(ticketId: string, voucher2: string): void {
        this.recordSecondApproval(ticketId, voucher2);
    }
};
