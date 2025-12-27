import { Client, GatewayIntentBits, Events, Collection } from 'discord.js';
import { config } from './config';
import { initDb } from './lib/db';
import { initScheduler } from './lib/scheduler';
import logger from './lib/logger';
import fs from 'fs';
import path from 'path';

// Extend Client to support commands
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, any>;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// Initialize DB
initDb();

if (!config.DISCORD_TOKEN) {
    logger.error('CRITICAL: DISCORD_TOKEN is not set in .env. Bot cannot start.');
    process.exit(1);
}

const loadEvents = async () => {
    const eventsPath = path.join(__dirname, 'events');
    if (fs.existsSync(eventsPath)) {
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        await Promise.all(eventFiles.map(async file => {
             const filePath = path.join(eventsPath, file);
             const eventModule = await import(filePath);
             const event = eventModule.default;
             if (event.once) {
                 client.once(event.name, (...args) => event.execute(...args));
             } else {
                 client.on(event.name, (...args) => event.execute(...args));
             }
        }));
    }
};

const loadCommands = async () => {
    const commandsPath = path.join(__dirname, 'commands');
    if (fs.existsSync(commandsPath)) {
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        
        await Promise.all(commandFiles.map(async file => {
            const filePath = path.join(commandsPath, file);
            const commandModule = await import(filePath);
            const command = commandModule.default;
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command);
            } else {
                logger.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }));
    }
};

(async () => {
    await loadEvents();
    await loadCommands();
    
    client.once(Events.ClientReady, (c) => {
        initScheduler(c);
    });

    client.login(config.DISCORD_TOKEN);
})();

// Graceful Shutdown
process.on('SIGINT', () => {
    logger.info('SIGINT received. Closing DB and exiting...');
    // db.close() if db export had a close method, better-sqlite3 closes automatically on exit usually,
    // but explicit close is good practice if we exported the instance directly.
    // Since we import 'db' directly in modules, better-sqlite3 handles process exit cleanup.
    client.destroy();
    process.exit(0);
});