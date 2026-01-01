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
        .setDescription('Server owner: Register founding brothers on a fresh installation')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to bootstrap (defaults to yourself)')
                .setRequired(false)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        const invokerId = interaction.user.id;

        // Must be in a guild
        if (!guild) {
            await interaction.reply({
                content: 'This command must be used in a server.',
                ephemeral: true
            });
            return;
        }

        // Check 1: Only server owner can use this command
        if (guild.ownerId !== invokerId) {
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

        // Determine target user (self or specified user)
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const targetId = targetUser.id;
        const isSelf = targetId === invokerId;

        // Check 3: If target is already a brother, inform them
        const existingUser = userRepository.getByDiscordId(targetId);
        if (existingUser?.status === 'BROTHER') {
            await interaction.reply({
                content: isSelf
                    ? 'You are already registered as a brother.'
                    : `${targetUser.username} is already registered as a brother.`,
                ephemeral: true
            });
            return;
        }

        // Show bootstrap modal
        // CustomId format: bootstrap_modal_{invokerId}_{targetId}
        const modal = new ModalBuilder()
            .setCustomId(`bootstrap_modal_${invokerId}_${targetId}`)
            .setTitle(isSelf ? 'Founding Brother Registration' : `Register ${targetUser.username}`);

        const firstNameInput = new TextInputBuilder()
            .setCustomId('first_name')
            .setLabel(isSelf ? 'First Name' : `${targetUser.username}'s First Name`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50)
            .setPlaceholder('John');

        const lastNameInput = new TextInputBuilder()
            .setCustomId('last_name')
            .setLabel(isSelf ? 'Last Name' : `${targetUser.username}'s Last Name`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50)
            .setPlaceholder('Smith');

        const donNameInput = new TextInputBuilder()
            .setCustomId('don_name')
            .setLabel('Don Name (brother name, optional)')
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

        const targetDesc = isSelf ? 'self' : `user ${targetUser.tag}`;
        logger.info(`[Bootstrap] ${interaction.user.tag} (${invokerId}) initiated bootstrap for ${targetDesc}`);
        await interaction.showModal(modal);
    }
};
