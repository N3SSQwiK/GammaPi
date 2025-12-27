import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import db from '../lib/db';

export default {
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('Search the Professional Rolodex')
        .addStringOption(option => option.setName('industry').setDescription('Filter by Industry').setRequired(false))
        .addStringOption(option => option.setName('city').setDescription('Filter by City').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const industry = interaction.options.getString('industry');
        
        let query = 'SELECT real_name, industry, zip_code FROM users WHERE status = "BROTHER"';
        const params: any[] = [];

        if (industry) {
            query += ' AND industry LIKE ?';
            params.push(`%${industry}%`);
        }

        const stmt = db.prepare(query);
        const results = stmt.all(...params) as any[];

        if (results.length === 0) {
            await interaction.reply({ content: 'No brothers found matching your criteria.', ephemeral: true });
            return;
        }

        const list = results.map(u => `• **${u.real_name}** - ${u.industry || 'N/A'} (${u.zip_code})`).join('\n');
        await interaction.reply({ content: `**Found Brothers:**\n${list}`, ephemeral: true });
    },
};
