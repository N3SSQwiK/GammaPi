import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { runSetup } from '../modules/audit/setupHandler';

export default {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('ONE-TIME: Auto-create missing Roles and Channels based on Spec.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        if (!guild) return;

        await interaction.deferReply();
        
        const report = await runSetup(guild);

        const embed = new EmbedBuilder()
            .setTitle('🏗️ Server Construction Report')
            .setColor('#0099FF')
            .setDescription(report.join('\n').substring(0, 4000)) // Discord limit safety
            .setFooter({ text: 'Please manually arrange Channel Categories after this.' })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
