import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, TextChannel } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Displays the Verification Gate (Admin Only)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor('#B41528')
            .setTitle('🦁 Welcome to Gamma Pi')
            .setDescription(
                'This is the official Discord server for the **Gamma Pi Graduate/Professional Chapter** of **Phi Iota Alpha Fraternity**.\n\n' +
                'To access the server, you must complete our verification process.\n\n' +
                '**Click the button below to get started.**'
            )
            .addFields(
                {
                    name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    value: '\u200B'
                },
                {
                    name: '👔 Brothers of Phi Iota Alpha',
                    value: 'Full access to all channels, professional networking, voting rights, and career resources.'
                },
                {
                    name: '\u200B',
                    value: '\u200B'
                },
                {
                    name: '🌍 Guests & Prospective Members',
                    value: 'Limited access to public channels and event invitations.'
                },
                {
                    name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    value: '\u200B'
                }
            )
            .setFooter({ text: 'Phi Iota Alpha Fraternity • La Unión Hace La Fuerza' });

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_gate_start')
                    .setLabel('🚀 Get Verified')
                    .setStyle(ButtonStyle.Primary)
            );

        const channel = interaction.channel;

        if (!channel || !('send' in channel)) {
            await interaction.reply({
                content: '❌ Cannot post in this channel type.',
                ephemeral: true
            });
            return;
        }

        // Post to channel (not as ephemeral reply)
        await (channel as TextChannel).send({ embeds: [embed], components: [row] });

        await interaction.reply({
            content: '✅ Verification gate has been posted.',
            ephemeral: true
        });
    },
};
