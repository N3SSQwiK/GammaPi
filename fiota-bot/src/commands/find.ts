import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { userRepository } from '../lib/repositories/userRepository';
import { getDisplayName } from '../lib/displayNameBuilder';

export default {
    data: new SlashCommandBuilder()
        .setName('find')
        .setDescription('Search the Professional Rolodex')
        .addStringOption(option => option.setName('industry').setDescription('Filter by Industry').setRequired(false))
        .addStringOption(option => option.setName('city').setDescription('Filter by City').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction) {
        const industry = interaction.options.getString('industry');

        if (!industry) {
            await interaction.reply({ content: 'Please provide an industry to search for.', ephemeral: true });
            return;
        }

        const results = userRepository.findBrothersByIndustry(industry);

        if (results.length === 0) {
            await interaction.reply({ content: 'No brothers found matching your criteria.', ephemeral: true });
            return;
        }

        const list = results.map(u => `• **${getDisplayName(u, 'full')}** - ${u.industry || 'N/A'} (${u.city || u.zip_code || 'N/A'})`).join('\n');
        await interaction.reply({ content: `**Found Brothers:**\n${list.substring(0, 1900)}`, ephemeral: true });
    },
};