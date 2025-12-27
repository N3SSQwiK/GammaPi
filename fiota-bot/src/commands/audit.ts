import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { runAudit } from '../modules/audit/auditHandler';

export default {
    data: new SlashCommandBuilder()
        .setName('audit')
        .setDescription('Run a compliance check on the server configuration')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction: ChatInputCommandInteraction) {
        await runAudit(interaction);
    },
};
