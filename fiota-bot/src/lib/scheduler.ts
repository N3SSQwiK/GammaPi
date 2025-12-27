import cron from 'node-cron';
import { Client } from 'discord.js';
import { config } from '../config';
import { runAutomatedAudit } from '../modules/audit/auditHandler';
import logger from './logger';

export function initScheduler(client: Client) {
    logger.info('[Scheduler] Initializing...');

    // Weekly Audit Task
    cron.schedule(config.AUDIT_CRON_SCHEDULE, async () => {
        logger.info('[Scheduler] Running scheduled audit...');
        
        try {
            // Get the specific guild
            const guild = await client.guilds.fetch(config.GUILD_ID);
            if (guild) {
                await runAutomatedAudit(guild);
            } else {
                logger.error('[Scheduler] Error: Could not fetch guild configured in GUILD_ID');
            }
        } catch (error) {
            logger.error('[Scheduler] Error during scheduled audit:', error);
        }
    });

    logger.info(`[Scheduler] Weekly audit scheduled with cron: ${config.AUDIT_CRON_SCHEDULE}`);
}
