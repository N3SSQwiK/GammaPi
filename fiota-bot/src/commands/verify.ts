import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Displays the Verification Gate (Admin Only)'),
    async execute(interaction: ChatInputCommandInteraction) {
        // In real app, check permissions
        
        const embed = new EmbedBuilder()
            .setColor('#B41528') // Gamma Pi Red (approx)
            .setTitle('Welcome to Gamma Pi (Graduate Chapter)')
            .setDescription('Please select your verification path below to gain access to the server.')
            .addFields(
                { name: '🦁 Brother Verification', value: 'For Initiated Brothers of Phi Iota Alpha (Gamma Pi or Other Chapters).' },
                { name: '👔 Guest / Interest Access', value: 'For Candidates, Interests, and Guests. (Requires LinkedIn).' }
            );

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('verify_brother_start')
                    .setLabel('Brother Verification')
                    .setStyle(ButtonStyle.Danger), // Red
                new ButtonBuilder()
                    .setCustomId('verify_guest_start')
                    .setLabel('Guest Access')
                    .setStyle(ButtonStyle.Secondary) // Grey
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
