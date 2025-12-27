import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import db from '../lib/db';

export default {
    data: new SlashCommandBuilder()
        .setName('mentor')
        .setDescription('Toggle your Mentorship status')
        .addStringOption(option => 
            option.setName('status')
            .setDescription('Are you open to mentoring?')
            .setRequired(true)
            .addChoices(
                { name: 'Open to Mentor', value: 'ON' },
                { name: 'Unavailable', value: 'OFF' }
            )),
    async execute(interaction: ChatInputCommandInteraction) {
        const status = interaction.options.getString('status', true);
        const isMentor = status === 'ON' ? 1 : 0;
        const userId = interaction.user.id;

        // Update DB
        const stmt = db.prepare('UPDATE users SET is_mentor = ? WHERE discord_id = ?');
        const info = stmt.run(isMentor, userId);

        if (info.changes === 0) {
            // User not in DB yet (maybe manual verify?)
            db.prepare('INSERT INTO users (discord_id, is_mentor) VALUES (?, ?)').run(userId, isMentor);
        }

        // Add/Remove Role (Stub)
        // const role = interaction.guild?.roles.cache.find(r => r.name === '🧠 Open to Mentor');
        // if (role) { ... }

        await interaction.reply({ content: `✅ Mentorship status updated to: **${status}**.`, ephemeral: true });
    },
};
