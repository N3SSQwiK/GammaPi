/**
 * Data Export Script for Power Query / Excel / Power BI
 *
 * Exports all FiotaBot database tables to CSV format.
 * Run with: npm run export
 */

import db from './lib/db';
import fs from 'fs';
import path from 'path';

const EXPORTS_DIR = path.resolve(__dirname, '../exports');

// Ensure exports directory exists
if (!fs.existsSync(EXPORTS_DIR)) {
    fs.mkdirSync(EXPORTS_DIR, { recursive: true });
    console.log(`📁 Created exports directory: ${EXPORTS_DIR}`);
}

/**
 * Convert array of objects to CSV string
 */
const toCSV = (data: Record<string, unknown>[]): string => {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = data.map(row =>
        headers.map(header => {
            const value = row[header];
            // Handle null, undefined, and values containing commas/quotes
            if (value === null || value === undefined) return '';
            const str = String(value);
            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        }).join(',')
    );

    return [headers.join(','), ...rows].join('\n');
};

/**
 * Export a table to CSV
 */
const exportTable = (tableName: string, query?: string): number => {
    const sql = query || `SELECT * FROM ${tableName}`;
    const data = db.prepare(sql).all() as Record<string, unknown>[];

    const csvContent = toCSV(data);
    const filePath = path.join(EXPORTS_DIR, `${tableName}.csv`);

    fs.writeFileSync(filePath, csvContent, 'utf-8');
    console.log(`✅ Exported ${tableName}: ${data.length} rows → ${filePath}`);

    return data.length;
};

// Main export logic
console.log('\n🚀 FiotaBot Data Export');
console.log('═'.repeat(50));
console.log(`📅 Export Time: ${new Date().toISOString()}\n`);

// Export all tables
const tables = [
    { name: 'users', query: `
        SELECT
            discord_id,
            first_name,
            last_name,
            don_name,
            real_name,
            status,
            rules_agreed_at,
            chapter,
            initiation_year,
            initiation_semester,
            phone_number,
            zip_code,
            city,
            state_province,
            country,
            industry,
            job_title,
            linked_in_id,
            is_mentor
        FROM users
        ORDER BY status DESC, last_name ASC
    `},
    { name: 'verification_tickets', query: `
        SELECT
            ticket_id,
            user_id,
            named_voucher_1,
            named_voucher_2,
            voucher_1,
            voucher_2,
            created_at,
            voucher_1_at,
            voucher_2_at,
            status
        FROM verification_tickets
        ORDER BY created_at DESC
    `},
    { name: 'attendance', query: `
        SELECT
            meeting_id,
            date,
            topic,
            attendees
        FROM attendance
        ORDER BY date DESC
    `},
    { name: 'votes', query: `
        SELECT
            poll_id,
            user_id,
            choice
        FROM votes
        ORDER BY poll_id
    `}
];

let totalRows = 0;
for (const table of tables) {
    totalRows += exportTable(table.name, table.query);
}

// Create a summary file with export metadata
const summary = {
    exportedAt: new Date().toISOString(),
    tables: tables.map(t => t.name),
    totalRows,
    exportPath: EXPORTS_DIR
};

fs.writeFileSync(
    path.join(EXPORTS_DIR, '_export_metadata.json'),
    JSON.stringify(summary, null, 2)
);

console.log('\n' + '═'.repeat(50));
console.log(`📊 Total: ${totalRows} rows exported to ${EXPORTS_DIR}`);
console.log('📋 Metadata saved to _export_metadata.json');
console.log('\n💡 Import these CSVs into Power Query via: Get Data → From Text/CSV\n');
