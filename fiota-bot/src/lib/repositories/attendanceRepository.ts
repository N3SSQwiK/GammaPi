import db from '../db';

export interface AttendanceRow {
    meeting_id: number;
    date: string;
    topic: string | null;
    attendees: string; // JSON string
}

export const attendanceRepository = {
    create(topic: string): number {
        const info = db.prepare('INSERT INTO attendance (date, topic, attendees) VALUES (?, ?, ?)')
            .run(new Date().toISOString(), topic, '[]');
        return info.lastInsertRowid as number;
    },

    getById(meetingId: number): AttendanceRow | undefined {
        return db.prepare('SELECT * FROM attendance WHERE meeting_id = ?').get(meetingId) as AttendanceRow | undefined;
    },

    updateAttendees(meetingId: number, attendees: string[]): void {
        db.prepare('UPDATE attendance SET attendees = ? WHERE meeting_id = ?').run(JSON.stringify(attendees), meetingId);
    }
};
