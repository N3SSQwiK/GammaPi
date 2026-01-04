import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    TextChannel
} from 'discord.js';
import { runSetup } from '../modules/audit/setupHandler';
import { userRepository } from '../lib/repositories/userRepository';
import { searchChapters, searchIndustries, getChapterByValue, isValidIndustry, getAllChapters } from '../lib/constants';
import { pendingInitRegistrations } from '../lib/verificationState';
import { createRulesEmbed } from '../modules/access/rulesHandler';
import logger from '../lib/logger';

/**
 * Creates the Verification Gate embed (same as /verify command)
 */
function createVerificationGateEmbed(): { embed: EmbedBuilder; row: ActionRowBuilder<ButtonBuilder> } {
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

    return { embed, row };
}

const BOOTSTRAP_THRESHOLD = 2;

export default {
    data: new SlashCommandBuilder()
        .setName('init')
        .setDescription('Server owner: Initialize server and register founding brothers')
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
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('User to register as founding brother (defaults to yourself)')
                .setRequired(false)
        ),

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedOption = interaction.options.getFocused(true);
        const query = focusedOption.value;

        let choices: { name: string; value: string }[] = [];

        if (focusedOption.name === 'chapter') {
            // For init, show ALL chapters including hidden (e.g., Omega) since this is server owner
            const chapters = query
                ? searchChapters(query, true)
                : getAllChapters();
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
                content: '🔒 Only the server owner can use `/init`.',
                ephemeral: true
            });
            return;
        }

        // Check 2: Bootstrap portion disabled once 2+ brothers exist
        const brotherCount = userRepository.countBrothers();
        if (brotherCount >= BOOTSTRAP_THRESHOLD) {
            await interaction.reply({
                content: `⚠️ Server already initialized with ${brotherCount} brothers.\n\nUse \`/audit\` to check server status or \`/verify-start\` for new verifications.`,
                ephemeral: true
            });
            return;
        }

        // Get and validate chapter
        const chapterValue = interaction.options.getString('chapter', true);
        const chapter = getChapterByValue(chapterValue);
        if (!chapter) {
            await interaction.reply({
                content: `Invalid chapter "${chapterValue}". Please use the autocomplete suggestions.`,
                ephemeral: true
            });
            return;
        }

        // Get and validate industry
        const industryValue = interaction.options.getString('industry', true);
        if (!isValidIndustry(industryValue)) {
            await interaction.reply({
                content: `Invalid industry "${industryValue}". Please use the autocomplete suggestions.`,
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
                    ? '✅ You are already registered as a brother.\n\nRun `/init` with a different user to register another founding brother.'
                    : `✅ ${targetUser.username} is already registered as a brother.`,
                ephemeral: true
            });
            return;
        }

        // Step 1: Run setup to create infrastructure FIRST
        await interaction.deferReply({ ephemeral: true });

        logger.info(`[Init] ${interaction.user.tag} (${invokerId}) starting server initialization`);

        const setupReport = await runSetup(guild);

        // Build setup summary
        const createdItems = setupReport.filter(line => line.startsWith('✅'));

        const setupSummary = createdItems.length > 0
            ? `**Infrastructure Created:**\n${createdItems.slice(0, 8).join('\n')}${createdItems.length > 8 ? `\n...and ${createdItems.length - 8} more` : ''}`
            : '**Infrastructure:** All roles and channels already exist.';

        // Post embeds to their designated channels
        const embedsPosted: string[] = [];

        // Re-fetch channels after setup (they may have just been created)
        await guild.channels.fetch();

        // Post Rules embed to #rules-and-conduct
        const rulesChannel = guild.channels.cache.find(c => c.name === 'rules-and-conduct') as TextChannel | undefined;
        if (rulesChannel) {
            try {
                const { embed: rulesEmbed, row: rulesRow } = createRulesEmbed();
                await rulesChannel.send({ embeds: [rulesEmbed], components: [rulesRow] });
                embedsPosted.push('📜 Code of Conduct → #rules-and-conduct');
                logger.info(`[Init] Posted Rules embed to #rules-and-conduct`);
            } catch (err) {
                logger.error(`[Init] Failed to post Rules embed:`, err);
            }
        } else {
            logger.warn(`[Init] #rules-and-conduct channel not found - skipping Rules embed`);
        }

        // Post Verification Gate to #welcome-gate
        const welcomeChannel = guild.channels.cache.find(c => c.name === 'welcome-gate') as TextChannel | undefined;
        if (welcomeChannel) {
            try {
                const { embed: verifyEmbed, row: verifyRow } = createVerificationGateEmbed();
                await welcomeChannel.send({ embeds: [verifyEmbed], components: [verifyRow] });
                embedsPosted.push('🚀 Verification Gate → #welcome-gate');
                logger.info(`[Init] Posted Verification Gate to #welcome-gate`);
            } catch (err) {
                logger.error(`[Init] Failed to post Verification Gate:`, err);
            }
        } else {
            logger.warn(`[Init] #welcome-gate channel not found - skipping Verification Gate`);
        }

        // Build embeds summary
        const embedsSummary = embedsPosted.length > 0
            ? `\n\n**Embeds Posted:**\n${embedsPosted.join('\n')}`
            : '';

        // Store chapter and industry in server-side state for the modal flow
        pendingInitRegistrations.set(invokerId, {
            chapter: chapterValue,
            industry: industryValue,
            targetId: targetId,
            expiresAt: Date.now() + 15 * 60 * 1000 // 15 minute expiry
        });

        // Show setup results with "Light the Torch" button
        const embed = new EmbedBuilder()
            .setTitle('🚀 Server Initialization')
            .setColor('#B41528')
            .setDescription(
                `${setupSummary}${embedsSummary}\n\n` +
                `**Chapter:** ${chapter.label}\n` +
                `**Industry:** ${industryValue}\n\n` +
                `**Next Step:** Light the torch and register ${isSelf ? 'yourself' : targetUser.username} as a founding lion.`
            )
            .setFooter({ text: `Brothers registered: ${brotherCount}/${BOOTSTRAP_THRESHOLD}` });

        const registerButton = new ButtonBuilder()
            .setCustomId(`init_register_${invokerId}_${targetId}`)
            .setLabel('Light the Torch')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🦁');

        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(registerButton);

        await interaction.editReply({
            embeds: [embed],
            components: [buttonRow]
        });

        logger.info(`[Init] Setup complete for ${guild.name}. Awaiting "Light the Torch" for ${isSelf ? 'self' : targetUser.tag}`);
    }
};
