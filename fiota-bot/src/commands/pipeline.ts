import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('pipeline')
        .setDescription('Manage Candidate Pipeline (Committee Only)')
        .addUserOption(option => option.setName('user').setDescription('The Candidate').setRequired(true))
        .addStringOption(option => 
            option.setName('status')
            .setDescription('New Status')
            .setRequired(true)
            .addChoices(
                { name: 'Applied', value: 'APPLIED' },
                { name: 'Interview', value: 'INTERVIEW' },
                { name: 'Decision Pending', value: 'DECISION' }
            ))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles), // Restricted
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser('user', true);
        const status = interaction.options.getString('status', true);

        // In real app: Update DB, Change Roles, Log to Channel
        await interaction.reply({ content: `✅ Updated ${user?.username}'s status to **${status}**.`, ephemeral: true });
    },
};
