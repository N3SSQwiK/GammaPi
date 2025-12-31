import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} from 'discord.js';
import { userRepository } from '../lib/repositories/userRepository';
import { validatePhoneNumber, normalizePhoneNumber, validateName, normalizeName } from '../lib/validation';
import { getDisplayName } from '../lib/displayNameBuilder';

export default {
    data: new SlashCommandBuilder()
        .setName('profile-update')
        .setDescription('Update your profile information (don name, phone, etc.)'),

    async execute(interaction: ChatInputCommandInteraction) {
        const userId = interaction.user.id;

        // Get existing user data
        const user = userRepository.getByDiscordId(userId);
        if (!user) {
            await interaction.reply({
                content: 'You are not in the database. Please complete verification first.',
                ephemeral: true
            });
            return;
        }

        // Create modal with current values pre-filled where possible
        const modal = new ModalBuilder()
            .setCustomId('profile_update_modal')
            .setTitle('Update Your Profile');

        const donNameInput = new TextInputBuilder()
            .setCustomId('don_name')
            .setLabel('Don Name (your brother name)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(50)
            .setPlaceholder('Phoenix')
            .setValue(user.don_name || '');

        const phoneInput = new TextInputBuilder()
            .setCustomId('phone')
            .setLabel('Phone Number')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setPlaceholder('(555) 123-4567')
            .setValue(user.phone_number || '');

        const jobTitleInput = new TextInputBuilder()
            .setCustomId('job_title')
            .setLabel('Job Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(100)
            .setPlaceholder('Software Engineer')
            .setValue(user.job_title || '');

        const cityInput = new TextInputBuilder()
            .setCustomId('city')
            .setLabel('City')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(100)
            .setPlaceholder('New York')
            .setValue(user.city || '');

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(donNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(phoneInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(jobTitleInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(cityInput)
        );

        await interaction.showModal(modal);
    }
};
