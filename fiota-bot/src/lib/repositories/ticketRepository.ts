import db from '../db';

export interface TicketRow {
    ticket_id: string;
    user_id: string;
    voucher_1: string | null;
    voucher_2: string | null;
    status: string;
}

export const ticketRepository = {
    getById(ticketId: string): TicketRow | undefined {
        return db.prepare('SELECT * FROM verification_tickets WHERE ticket_id = ?').get(ticketId) as TicketRow | undefined;
    },

    create(ticketId: string, userId: string): void {
        db.prepare(`
            INSERT INTO verification_tickets (ticket_id, user_id, status)
            VALUES (?, ?, 'PENDING')
        `).run(ticketId, userId);
    },

    updateVoucher1(ticketId: string, voucher1: string): void {
        db.prepare('UPDATE verification_tickets SET voucher_1 = ?, status = "PENDING_2" WHERE ticket_id = ?').run(voucher1, ticketId);
    },

    updateVoucher2(ticketId: string, voucher2: string): void {
        db.prepare('UPDATE verification_tickets SET voucher_2 = ?, status = "VERIFIED" WHERE ticket_id = ?').run(voucher2, ticketId);
    }
};
