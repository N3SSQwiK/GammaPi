import cron from 'node-cron';
import { Client } from 'discord.js';
import { config } from '../config';
import { runAutomatedAudit } from '../modules/audit/auditHandler';

export function initScheduler(client: Client) {
    console.log('[Scheduler] Initializing...');

    // Weekly Audit Task
    cron.schedule(config.AUDIT_CRON_SCHEDULE, async () => {
        console.log('[Scheduler] Running scheduled audit...');
        
        try {
            // Get the specific guild
            const guild = await client.guilds.fetch(config.GUILD_ID);
            if (guild) {
                await runAutomatedAudit(guild);
            } else {
                console.error('[Scheduler] Error: Could not fetch guild configured in GUILD_ID');
            }
        } catch (error) {
            console.error('[Scheduler] Error during scheduled audit:', error);
        }
    });

    console.log(`[Scheduler] Weekly audit scheduled with cron: ${config.AUDIT_CRON_SCHEDULE}`);
}
