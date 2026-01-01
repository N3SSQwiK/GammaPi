import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} from 'discord.js';
import { userRepository } from '../lib/repositories/userRepository';
import logger from '../lib/logger';

const BOOTSTRAP_THRESHOLD = 2;

export default {
    data: new SlashCommandBuilder()
        .setName('bootstrap')
        .setDescription('Server owner: Register yourself as a founding brother on a fresh installation'),

    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        const userId = interaction.user.id;

        // Must be in a guild
        if (!guild) {
            await interaction.reply({
                content: 'This command must be used in a server.',
                ephemeral: true
            });
            return;
        }

        // Check 1: Only server owner can use this command
        if (guild.ownerId !== userId) {
            await interaction.reply({
                content: 'Only the server owner can use this command.',
                ephemeral: true
            });
            return;
        }

        // Check 2: Bootstrap is disabled once 2+ brothers exist
        const brotherCount = userRepository.countBrothers();
        if (brotherCount >= BOOTSTRAP_THRESHOLD) {
            await interaction.reply({
                content: `Bootstrap is disabled. ${brotherCount} brothers already exist. Use \`/verify-start\` for verification.`,
                ephemeral: true
            });
            return;
        }

        // Check 3: If owner is already a brother, inform them
        const existingUser = userRepository.getByDiscordId(userId);
        if (existingUser?.status === 'BROTHER') {
            await interaction.reply({
                content: 'You are already registered as a brother.',
                ephemeral: true
            });
            return;
        }

        // Show bootstrap modal
        const modal = new ModalBuilder()
            .setCustomId(`bootstrap_modal_${userId}`)
            .setTitle('Founding Brother Registration');

        const firstNameInput = new TextInputBuilder()
            .setCustomId('first_name')
            .setLabel('First Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50)
            .setPlaceholder('John');

        const lastNameInput = new TextInputBuilder()
            .setCustomId('last_name')
            .setLabel('Last Name')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50)
            .setPlaceholder('Smith');

        const donNameInput = new TextInputBuilder()
            .setCustomId('don_name')
            .setLabel('Don Name (your brother name, optional)')
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
            .setMaxLength(50)
            .setPlaceholder('Phoenix');

        const yearSemesterInput = new TextInputBuilder()
            .setCustomId('year_semester')
            .setLabel('Initiation Year & Semester')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('2015 Spring');

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(firstNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(lastNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(donNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(yearSemesterInput)
        );

        logger.info(`[Bootstrap] ${interaction.user.tag} (${userId}) initiated bootstrap flow`);
        await interaction.showModal(modal);
    }
};
