import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    PermissionFlagsBits
} from 'discord.js';
import { getAllChapters, getChapterByValue } from '../lib/constants';
import { userRepository } from '../lib/repositories/userRepository';
import { getDisplayName, formatChapterName } from '../lib/displayNameBuilder';
import logger from '../lib/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('chapter-assign')
        .setDescription('E-Board: Assign a brother to a specific chapter (including Omega)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The brother to assign')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('chapter')
                .setDescription('The chapter to assign (includes hidden chapters like Omega)')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const query = focusedValue.toLowerCase();

        // Get all chapters including hidden ones (Omega)
        const allChapters = getAllChapters();
        const filtered = allChapters
            .filter(ch =>
                ch.label.toLowerCase().includes(query) ||
                ch.institution.toLowerCase().includes(query) ||
                ch.value.toLowerCase().includes(query)
            )
            .slice(0, 25);

        await interaction.respond(
            filtered.map(ch => ({
                name: `${ch.label} - ${ch.institution}${ch.hidden ? ' [HIDDEN]' : ''}`.substring(0, 100),
                value: ch.value
            }))
        );
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const targetUser = interaction.options.getUser('user', true);
        const chapterValue = interaction.options.getString('chapter', true);
        const admin = interaction.user;

        // Validate chapter
        const chapter = getChapterByValue(chapterValue);
        if (!chapter) {
            await interaction.reply({
                content: `Invalid chapter: \`${chapterValue}\`. Please use the autocomplete suggestions.`,
                ephemeral: true
            });
            return;
        }

        // Get user from database
        const userRow = userRepository.getByDiscordId(targetUser.id);
        if (!userRow) {
            await interaction.reply({
                content: `User <@${targetUser.id}> is not in the database. They need to complete verification first.`,
                ephemeral: true
            });
            return;
        }

        // Check if user is a brother
        if (userRow.status !== 'BROTHER') {
            await interaction.reply({
                content: `User <@${targetUser.id}> is not a verified brother (status: ${userRow.status}).`,
                ephemeral: true
            });
            return;
        }

        // Update chapter
        const previousChapter = userRow.chapter;
        userRepository.updateChapter(targetUser.id, chapterValue);

        logger.info(`[Access] Chapter assignment: ${admin.tag} (${admin.id}) assigned ${targetUser.tag} (${targetUser.id}) to ${chapter.label}. Previous: ${previousChapter || 'none'}`);

        const displayName = getDisplayName(userRow, 'full');

        await interaction.reply({
            content: `**Chapter Assignment Updated**\n\nBrother: ${displayName} (<@${targetUser.id}>)\nNew Chapter: **${chapter.label}**\n${chapter.institution}\n\n${previousChapter ? `Previous: ${formatChapterName(previousChapter)}` : 'No previous chapter on record.'}`,
            ephemeral: false
        });
    }
};
