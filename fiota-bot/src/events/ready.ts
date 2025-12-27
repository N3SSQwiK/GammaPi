import { Events, Client } from 'discord.js';
import logger from '../lib/logger';

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        logger.info(`Ready! Logged in as ${client.user?.tag}`);
    },
};
