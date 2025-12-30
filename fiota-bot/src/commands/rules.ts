import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, TextChannel } from 'discord.js';
import { createRulesEmbed } from '../modules/access/rulesHandler';

export default {
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Posts the Code of Conduct embed with agreement button (Admin Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        const { embed, row } = createRulesEmbed();
        const channel = interaction.channel;

        if (!channel || !('send' in channel)) {
            await interaction.reply({
                content: '❌ Cannot post in this channel type.',
                ephemeral: true
            });
            return;
        }

        // Post the embed to the channel (not as a reply, so it persists)
        await (channel as TextChannel).send({ embeds: [embed], components: [row] });

        await interaction.reply({
            content: '✅ Code of Conduct embed has been posted. Users must agree before accessing `#welcome-gate`.',
            ephemeral: true
        });
    },
};
