import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('cross')
        .setDescription('Cross a line (Promote Candidates to Brothers)')
        .addStringOption(option => option.setName('line_name').setDescription('e.g. Alpha Line').setRequired(true))
        .addStringOption(option => option.setName('semester').setDescription('e.g. Spring 2026').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction) {
        const lineName = interaction.options.getString('line_name', true);
        const semester = interaction.options.getString('semester', true);

        // Stub logic:
        // 1. Create Role "Line: {lineName}"
        // 2. Find all users with Role "Candidate"
        // 3. Remove "Candidate", Add "Brother", Add "Line:..."
        
        await interaction.reply({ content: `✅ Initiated Crossing Process for **${lineName}** (${semester}). (Stub Logic)`, ephemeral: true });
    },
};
