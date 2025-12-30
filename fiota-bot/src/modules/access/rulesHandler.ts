import { Interaction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { userRepository } from '../../lib/repositories/userRepository';
import logger from '../../lib/logger';

/**
 * Creates the Code of Conduct embed with agreement button
 */
export function createRulesEmbed(): { embed: EmbedBuilder; row: ActionRowBuilder<ButtonBuilder> } {
    const embed = new EmbedBuilder()
        .setColor('#B41528')
        .setTitle('📜 Gamma Pi Code of Conduct')
        .setDescription(
            'Welcome to the official Discord server for the **Gamma Pi Graduate/Professional Chapter** of **Phi Iota Alpha Fraternity**.\n\n' +
            'By participating in this community, you agree to uphold the following standards. These rules apply to all members, guests, and visitors.'
        )
        .addFields(
            {
                name: '🤝 Respect & Dignity',
                value:
                    '• Treat all members with respect and dignity, regardless of chapter, status, or background.\n' +
                    '• Personal attacks, insults, or derogatory comments will not be tolerated.\n' +
                    '• Disagreements should be handled constructively and privately when possible.'
            },
            {
                name: '💼 Professionalism',
                value:
                    '• This is a professional networking space. Conduct yourself accordingly.\n' +
                    '• Keep discussions appropriate for a workplace environment.\n' +
                    '• Represent the fraternity positively in all interactions.'
            },
            {
                name: '🚫 Prohibited Behavior',
                value:
                    '• No harassment, discrimination, or hate speech of any kind.\n' +
                    '• No spam, excessive self-promotion, or unsolicited advertisements.\n' +
                    '• No sharing of confidential fraternity business outside designated channels.'
            },
            {
                name: '⚠️ Enforcement',
                value:
                    '• Violations may result in warnings, temporary mutes, or removal from the server.\n' +
                    '• E-Board reserves the right to take action on any behavior deemed inappropriate.\n' +
                    '• All actions are logged and subject to review.'
            },
            {
                name: '\u200B',
                value: '**By clicking the button below, you acknowledge that you have read, understood, and agree to abide by this Code of Conduct.**'
            }
        )
        .setFooter({ text: 'Phi Iota Alpha Fraternity • La Unión Hace La Fuerza' })
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('rules_agree')
                .setLabel('✅ I Agree to the Code of Conduct')
                .setStyle(ButtonStyle.Success)
        );

    return { embed, row };
}

/**
 * Handles the rules agreement button click
 */
export async function handleRulesButton(interaction: Interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'rules_agree') return;

    const userId = interaction.user.id;
    const guild = interaction.guild;

    if (!guild) {
        await interaction.reply({ content: 'This action can only be performed in a server.', ephemeral: true });
        return;
    }

    try {
        const member = await guild.members.fetch(userId);
        const rulesRole = guild.roles.cache.find(r => r.name === '✅ Rules Accepted');

        // Check if role exists
        if (!rulesRole) {
            logger.error('[Rules] "✅ Rules Accepted" role not found. Run /setup to create it.');
            await interaction.reply({
                content: '❌ Server configuration error: Rules role not found. Please contact E-Board.',
                ephemeral: true
            });
            return;
        }

        const alreadyHasRole = member.roles.cache.has(rulesRole.id);

        // If user already has the role, ensure timestamp is recorded (handles migration edge case)
        if (alreadyHasRole) {
            if (!userRepository.hasAgreedToRules(userId)) {
                try {
                    userRepository.recordRulesAgreement(userId);
                    logger.info(`[Rules] Backfilled rules_agreed_at for ${interaction.user.tag} (${userId}) who already had role`);
                } catch (dbError) {
                    logger.error('[Rules] Failed to backfill rules_agreed_at:', dbError);
                }
            }
            await interaction.reply({
                content: '✅ You have already agreed to the Code of Conduct.',
                ephemeral: true
            });
            return;
        }

        // Grant the role first - if this fails, user can retry
        await member.roles.add(rulesRole);
        logger.info(`[Rules] Granted '✅ Rules Accepted' role to ${interaction.user.tag}`);

        // Record agreement - if this fails, log but don't fail the user (they have access)
        try {
            userRepository.recordRulesAgreement(userId);
            logger.info(`[Rules] User ${interaction.user.tag} (${userId}) agreed to Code of Conduct`);
        } catch (dbError) {
            logger.error(`[Rules] Failed to record agreement for ${interaction.user.tag}, but role was granted:`, dbError);
        }

        await interaction.reply({
            content:
                '✅ **Thank you for agreeing to the Code of Conduct!**\n\n' +
                'You now have access to `#welcome-gate` where you can complete your verification.\n\n' +
                '• **Brothers of Phi Iota Alpha**: Select "Brother Verification"\n' +
                '• **Guests & Prospective Members**: Select "Guest Access"',
            ephemeral: true
        });

    } catch (error) {
        logger.error('[Rules] Error handling rules agreement:', error);
        await interaction.reply({
            content: 'An error occurred while processing your agreement. Please try again or contact E-Board.',
            ephemeral: true
        });
    }
}
