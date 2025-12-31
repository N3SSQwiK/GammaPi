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
                'Please select the verification path that applies to you below.'
            )
            .addFields(
                {
                    name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
                    value: '\u200B'
                },
                {
                    name: '👔 ARE YOU A BROTHER OF PHI IOTA ALPHA?',
                    value:
                        'If you were **initiated into any chapter** of Phi Iota Alpha Fraternity, use the `/verify-start` command to begin verification.\n\n' +
                        '**Verification Process:**\n' +
                        '1️⃣ Run `/verify-start` and select your chapter & industry\n' +
                        '2️⃣ Fill out your identity information\n' +
                        '3️⃣ Name two ΓΠ brothers who can vouch for you\n' +
                        '4️⃣ Wait for any ΓΠ brother to approve your request\n\n' +
                        '**You will receive:**\n' +
                        '✅ Full access to all channels\n' +
                        '✅ Professional Rolodex & networking tools\n' +
                        '✅ Voting rights on chapter matters\n' +
                        '✅ Access to career resources & mentorship'
                },
                {
                    name: '\u200B',
                    value: '\u200B'
                },
                {
                    name: '🌍 ARE YOU A GUEST OR PROSPECTIVE MEMBER?',
                    value:
                        'If you are **interested in learning about Phi Iota Alpha** or connecting with the chapter, select **Guest Access** below.\n\n' +
                        '**This includes:**\n' +
                        '• Prospective members / Interests\n' +
                        '• Family members or friends of brothers\n' +
                        '• Professional contacts\n\n' +
                        '**You will receive:**\n' +
                        '⚠️ Limited access to public channels only\n' +
                        '⚠️ Cannot participate in chapter votes\n' +
                        '⚠️ May be invited to public events'
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
                    .setCustomId('verify_guest_start')
                    .setLabel('🌍 Guest Access')
                    .setStyle(ButtonStyle.Secondary)
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
