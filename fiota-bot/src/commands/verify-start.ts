import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} from 'discord.js';
import { searchChapters, searchIndustries, getChapterByValue, isValidIndustry } from '../lib/constants';
import { pendingVerifyStarts } from '../lib/verificationState';
import { userRepository } from '../lib/repositories/userRepository';

export default {
    data: new SlashCommandBuilder()
        .setName('verify-start')
        .setDescription('Start the brother verification process')
        .addStringOption(option =>
            option
                .setName('chapter')
                .setDescription('Your Phi Iota Alpha chapter')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option
                .setName('industry')
                .setDescription('Your professional industry')
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        const query = focusedOption.value;

        let choices: { name: string; value: string }[] = [];

        if (focusedOption.name === 'chapter') {
            const chapters = searchChapters(query);
            choices = chapters.map(ch => ({
                name: `${ch.label} - ${ch.institution}`.substring(0, 100),
                value: ch.value
            }));
        } else if (focusedOption.name === 'industry') {
            const industries = searchIndustries(query);
            choices = industries.map(ind => ({
                name: ind.substring(0, 100),
                value: ind
            }));
        }

        await interaction.respond(choices.slice(0, 25));
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const userId = interaction.user.id;
        const guild = interaction.guild;

        // Check 1: Must have agreed to rules first
        if (guild) {
            const member = await guild.members.fetch(userId);
            const hasRulesRole = member.roles.cache.some(r => r.name === '✅ Rules Accepted');
            const hasAgreedInDb = userRepository.hasAgreedToRules(userId);

            if (!hasRulesRole && !hasAgreedInDb) {
                await interaction.reply({
                    content: '📜 **You must agree to the Code of Conduct first.**\n\nPlease visit `#rules-and-conduct` and click "✅ I Agree" before starting verification.',
                    ephemeral: true
                });
                return;
            }

            // Edge case: Has DB record but lost role (rejoined server) - restore role
            if (hasAgreedInDb && !hasRulesRole) {
                const rulesRole = guild.roles.cache.find(r => r.name === '✅ Rules Accepted');
                if (rulesRole) {
                    await member.roles.add(rulesRole);
                }
            }
        }

        const chapterValue = interaction.options.getString('chapter', true);
        const industryValue = interaction.options.getString('industry', true);

        // Validate chapter
        const chapter = getChapterByValue(chapterValue);
        if (!chapter) {
            await interaction.reply({
                content: `Invalid chapter "${chapterValue}". Please use the autocomplete suggestions.`,
                ephemeral: true
            });
            return;
        }

        // Reject hidden chapters (e.g., Omega - reserved for E-Board assignment only)
        if (chapter.hidden) {
            await interaction.reply({
                content: `The ${chapter.label} is not available for self-verification. Please contact E-Board if you believe this is an error.`,
                ephemeral: true
            });
            return;
        }

        // Validate industry
        if (!isValidIndustry(industryValue)) {
            await interaction.reply({
                content: `Invalid industry "${industryValue}". Please use the autocomplete suggestions.`,
                ephemeral: true
            });
            return;
        }

        // Store chapter and industry in server-side state (not in customId to avoid truncation)
        pendingVerifyStarts.set(userId, {
            chapter: chapterValue,
            industry: industryValue,
            expiresAt: Date.now() + 15 * 60 * 1000 // 15 minute expiry
        });

        // Show Modal 1: Identity (name fields + year/semester)
        // Use simple customId with just user ID - data is in server-side state
        const modal = new ModalBuilder()
            .setCustomId(`verify_modal_1_${userId}`)
            .setTitle('Verification - Step 1 of 2');

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
            .setLabel('Don Name (your brother name)')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(50)
            .setPlaceholder('Phoenix');

        const yearSemesterInput = new TextInputBuilder()
            .setCustomId('year_semester')
            .setLabel('Initiation Year & Semester')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setPlaceholder('2015 Spring');

        const jobTitleInput = new TextInputBuilder()
            .setCustomId('job_title')
            .setLabel('Job Title')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setMaxLength(100)
            .setPlaceholder('Software Engineer');

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(firstNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(lastNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(donNameInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(yearSemesterInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(jobTitleInput)
        );

        await interaction.showModal(modal);
    }
};
