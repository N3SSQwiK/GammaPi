import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    ComponentType,
    ChannelType
} from 'discord.js';
import db from '../lib/db';
import logger from '../lib/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('☢️ NUCLEAR: Hard reset server to factory state (testing only)'),

    async execute(interaction: ChatInputCommandInteraction) {
        const guild = interaction.guild;
        const invokerId = interaction.user.id;
        const botId = interaction.client.user?.id;

        if (!guild) {
            await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
            return;
        }

        // Server owner only
        if (guild.ownerId !== invokerId) {
            await interaction.reply({
                content: '🔒 Only the server owner can hard reset the server.',
                ephemeral: true
            });
            return;
        }

        // Count what will be destroyed
        const roles = guild.roles.cache.filter(r =>
            r.id !== guild.id && // not @everyone
            !r.managed // not bot-managed roles
        );
        const channels = guild.channels.cache.filter(c => c.name !== 'general');
        const members = guild.members.cache.filter(m =>
            m.id !== invokerId && // not owner
            m.id !== botId && // not bot
            !m.user.bot // not other bots
        );

        const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };

        const warningEmbed = new EmbedBuilder()
            .setTitle('☢️ NUCLEAR RESET')
            .setColor('#FF0000')
            .setDescription(
                `**This will DESTROY everything and return the server to factory state.**\n\n` +
                `**What will be deleted:**\n` +
                `• 🗑️ ${roles.size} roles\n` +
                `• 🗑️ ${channels.size} channels\n` +
                `• 👢 ${members.size} members will be KICKED\n` +
                `• 🗄️ ${userCount.count} database records\n\n` +
                `**What remains:**\n` +
                `• #general channel\n` +
                `• Server owner (you)\n` +
                `• This bot\n` +
                `• @everyone role\n` +
                `• Bot-managed roles\n\n` +
                `**⚠️ THIS CANNOT BE UNDONE.**`
            )
            .setFooter({ text: 'Type "RESET" in chat within 30 seconds to confirm' });

        await interaction.reply({
            embeds: [warningEmbed],
            ephemeral: true
        });

        // Wait for "RESET" confirmation message
        const channel = interaction.channel;
        if (!channel || !('awaitMessages' in channel)) {
            await interaction.followUp({ content: 'Cannot wait for confirmation in this channel type.', ephemeral: true });
            return;
        }

        try {
            const collected = await channel.awaitMessages({
                filter: (m: { author: { id: string }; content: string }) => m.author.id === invokerId && m.content === 'RESET',
                max: 1,
                time: 30_000,
                errors: ['time']
            });

            if (!collected?.first()) {
                await interaction.followUp({ content: '⏳ Reset cancelled - no confirmation received.', ephemeral: true });
                return;
            }

            // Delete the confirmation message
            try {
                await collected.first()?.delete();
            } catch { /* ignore if can't delete */ }

        } catch {
            await interaction.followUp({ content: '⏳ Reset timed out. No changes were made.', ephemeral: true });
            return;
        }

        // Second confirmation with button
        const finalWarning = new EmbedBuilder()
            .setTitle('🔥 FINAL CONFIRMATION')
            .setColor('#FF0000')
            .setDescription(
                `You typed RESET.\n\n` +
                `**Click the button below to execute nuclear reset.**\n\n` +
                `There is no going back.`
            );

        const nukeButton = new ButtonBuilder()
            .setCustomId('reset_nuke')
            .setLabel('☢️ EXECUTE NUCLEAR RESET')
            .setStyle(ButtonStyle.Danger);

        const cancelButton = new ButtonBuilder()
            .setCustomId('reset_cancel')
            .setLabel('Abort')
            .setStyle(ButtonStyle.Secondary);

        const buttonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(nukeButton, cancelButton);

        const response = await interaction.followUp({
            embeds: [finalWarning],
            components: [buttonRow],
            ephemeral: true
        });

        try {
            const confirmation = await response.awaitMessageComponent({
                componentType: ComponentType.Button,
                filter: i => i.user.id === invokerId,
                time: 15_000
            });

            if (confirmation.customId === 'reset_cancel') {
                await confirmation.update({
                    content: '✅ Reset aborted. Server unchanged.',
                    embeds: [],
                    components: []
                });
                return;
            }

            // ==========================================
            // EXECUTE NUCLEAR RESET
            // ==========================================

            await confirmation.update({
                content: '☢️ **NUCLEAR RESET IN PROGRESS...**\n\nDo not close this window.',
                embeds: [],
                components: []
            });

            const results: string[] = [];
            logger.warn(`[RESET] ☢️ NUCLEAR RESET initiated by ${interaction.user.tag}`);

            // 1. Clear database
            db.prepare('DELETE FROM verification_tickets').run();
            db.prepare('DELETE FROM attendance').run();
            db.prepare('DELETE FROM votes').run();
            db.prepare('DELETE FROM users').run();
            results.push(`🗄️ Database cleared (${userCount.count} records)`);
            logger.info('[RESET] Database cleared');

            // 2. Kick members (except owner and bot)
            let kickedCount = 0;
            for (const [, member] of members) {
                try {
                    await member.kick('Server hard reset');
                    kickedCount++;
                } catch (e) {
                    logger.warn(`[RESET] Could not kick ${member.user.tag}: ${e}`);
                }
            }
            results.push(`👢 Kicked ${kickedCount} members`);
            logger.info(`[RESET] Kicked ${kickedCount} members`);

            // 3. Delete channels (except #general)
            let deletedChannels = 0;
            for (const [, channel] of channels) {
                try {
                    await channel.delete();
                    deletedChannels++;
                } catch (e) {
                    logger.warn(`[RESET] Could not delete channel ${channel.name}: ${e}`);
                }
            }
            results.push(`📁 Deleted ${deletedChannels} channels`);
            logger.info(`[RESET] Deleted ${deletedChannels} channels`);

            // 4. Delete roles (except @everyone and managed)
            let deletedRoles = 0;
            for (const [, role] of roles) {
                try {
                    await role.delete();
                    deletedRoles++;
                } catch (e) {
                    logger.warn(`[RESET] Could not delete role ${role.name}: ${e}`);
                }
            }
            results.push(`🏷️ Deleted ${deletedRoles} roles`);
            logger.info(`[RESET] Deleted ${deletedRoles} roles`);

            // Find #general to post completion message
            const generalChannel = guild.channels.cache.find(
                c => c.name === 'general' && c.type === ChannelType.GuildText
            );

            // Update the ephemeral message
            await confirmation.editReply({
                content: null,
                embeds: [
                    new EmbedBuilder()
                        .setTitle('☢️ Nuclear Reset Complete')
                        .setColor('#B41528')
                        .setDescription(
                            `**Results:**\n${results.join('\n')}\n\n` +
                            `Server has been reset to factory state.\n\n` +
                            `**Next:** Run \`/init\` to rebuild.`
                        )
                        .setFooter({ text: 'From the ashes, we rise.' })
                ],
                components: []
            });

            // Post public message in #general
            if (generalChannel && generalChannel.isTextBased()) {
                await generalChannel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('🦁 Server Reset Complete')
                            .setColor('#B41528')
                            .setDescription(
                                `The server has been reset to factory state.\n\n` +
                                `Welcome back to the beginning, founding lion.`
                            )
                    ]
                });
            }

            logger.warn(`[RESET] ☢️ NUCLEAR RESET COMPLETE`);

        } catch (error) {
            await interaction.followUp({
                content: '⏳ Reset timed out or failed. Some changes may have been made.',
                ephemeral: true
            });
            logger.error('[RESET] Error during reset:', error);
        }
    }
};
