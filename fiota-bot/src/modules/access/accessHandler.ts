import { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import db from '../../lib/db';
import { config } from '../../config';
import { userRepository } from '../../lib/repositories/userRepository';
import { ticketRepository } from '../../lib/repositories/ticketRepository';
import logger from '../../lib/logger';

export async function handleAccessButton(interaction: Interaction) {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId === 'verify_brother_start') {
            const modal = new ModalBuilder()
                .setCustomId('verify_brother_modal')
                .setTitle('Brother Verification');

            const nameInput = new TextInputBuilder()
                .setCustomId('real_name')
                .setLabel("Full Legal Name")
                .setStyle(TextInputStyle.Short);

            const chapterInput = new TextInputBuilder()
                .setCustomId('chapter_init')
                .setLabel("Chapter & Year (e.g. Gamma Pi, 2010)")
                .setStyle(TextInputStyle.Short);

            const voucherInput = new TextInputBuilder()
                .setCustomId('voucher_name')
                .setLabel("Voucher Name (ΓΠ Brother)")
                .setStyle(TextInputStyle.Short);

            const zipInput = new TextInputBuilder()
                .setCustomId('zip_code')
                .setLabel("Zip Code")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(5);
            
            const industryInput = new TextInputBuilder()
                 .setCustomId('industry')
                 .setLabel("Industry & Title")
                 .setStyle(TextInputStyle.Short)
                 .setPlaceholder("Tech / Software Engineer");

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(chapterInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(voucherInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(zipInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(industryInput)
            );

            await interaction.showModal(modal);
        } 
        
        if (interaction.customId === 'verify_guest_start') {
            await interaction.reply({ content: 'LinkedIn Verification Link: [Click Here](https://linkedin.com) (Stub)', ephemeral: true });
        }
        
        if (interaction.customId.startsWith('approve_ticket_')) {
            const ticketId = interaction.customId.split('_')[2];
            const approver = interaction.user;
            
            const processApproval = db.transaction(() => {
                const currentTicket = ticketRepository.getById(ticketId);
                
                if (!currentTicket) return { success: false, msg: 'Ticket not found.' };
                if (currentTicket.status === 'VERIFIED') return { success: false, msg: 'User already verified.' };
                
                if (currentTicket.voucher_1 === approver.id || currentTicket.voucher_2 === approver.id) {
                    return { success: false, msg: 'You have already approved this ticket.' };
                }

                if (!currentTicket.voucher_1) {
                    ticketRepository.updateVoucher1(ticketId, approver.id);
                    return { success: true, status: '1/2' };
                } else {
                    ticketRepository.updateVoucher2(ticketId, approver.id);
                    userRepository.updateStatus(currentTicket.user_id, 'BROTHER');
                    return { success: true, status: 'VERIFIED', userId: currentTicket.user_id };
                }
            });

            const result = processApproval();

            if (!result.success) {
                await interaction.reply({ content: result.msg, ephemeral: true });
                return;
            }

            if (result.status === '1/2') {
                 await interaction.reply({ content: `✅ First approval recorded for Ticket ${ticketId}. One more needed.`, ephemeral: true });
            } else if (result.status === 'VERIFIED') {
                 const guild = interaction.guild;
                 const member = await guild?.members.fetch(result.userId!);
                 const brotherRole = guild?.roles.cache.find(r => r.name === '🦁 ΓΠ Brother');
                 
                 if (member && brotherRole) {
                     await member.roles.add(brotherRole);
                     await interaction.reply({ content: `✅✅ Second approval recorded! **${member.user.username}** is now Verified and has the Brother role.`, ephemeral: false });
                 } else {
                     await interaction.reply({ content: `✅ Verified (Database updated), but failed to assign Discord Role. Check logs.`, ephemeral: true });
                     logger.error('[Access] Role assignment failed. Member or Role not found.');
                 }
            }
        }
    } catch (error) {
        logger.error('[Access] Button error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
}

export async function handleAccessModal(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    try {
        if (interaction.customId === 'verify_brother_modal') {
            const realName = interaction.fields.getTextInputValue('real_name');
            const chapter = interaction.fields.getTextInputValue('chapter_init');
            const voucher = interaction.fields.getTextInputValue('voucher_name');
            const zip = interaction.fields.getTextInputValue('zip_code');
            const industry = interaction.fields.getTextInputValue('industry');

            const userId = interaction.user.id;
            const ticketId = `ticket_${userId}_${Date.now()}`;

            userRepository.upsert({
                discord_id: userId,
                real_name: realName,
                zip_code: zip,
                industry: industry
            });

            ticketRepository.create(ticketId, userId);

            const adminChannelId = config.VERIFICATION_CHANNEL_ID; 
            
            await interaction.reply({ content: `Application Submitted! Ticket ID: ${ticketId}. Please wait for 2 brothers to verify you.`, ephemeral: true });
            
            if (interaction.guild && adminChannelId) {
                const channel = interaction.guild.channels.cache.get(adminChannelId) as TextChannel;
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setTitle('New Verification Request')
                        .setColor('#B41528')
                        .addFields(
                            { name: 'User', value: `<@${userId}>` },
                            { name: 'Name', value: realName },
                            { name: 'Chapter', value: chapter },
                            { name: 'Voucher', value: voucher }
                        );
                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(new ButtonBuilder().setCustomId(`approve_ticket_${ticketId}`).setLabel('Approve').setStyle(ButtonStyle.Success));
                    await channel.send({ embeds: [embed], components: [row] });
                } else {
                    logger.error(`[Access] Could not find Verification Channel: ${adminChannelId}`);
                }
            }
        }
    } catch (error) {
        logger.error('[Access] Modal error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
}
