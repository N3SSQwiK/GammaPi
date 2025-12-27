import dotenv from 'dotenv';
dotenv.config();

export const config = {
    DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
    CLIENT_ID: process.env.CLIENT_ID || '',
    GUILD_ID: process.env.GUILD_ID || '',
    LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID || '',
    LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET || '',
    HOSTINGER_URL: process.env.HOSTINGER_URL || 'http://localhost:3000',
    AUDIT_CHANNEL_ID: process.env.AUDIT_CHANNEL_ID || '',
    AUDIT_CRON_SCHEDULE: process.env.AUDIT_CRON_SCHEDULE || '0 9 * * 1' // Default: Monday 9 AM
};

if (!config.DISCORD_TOKEN) {
    console.warn("WARNING: DISCORD_TOKEN is not set in .env");
}
