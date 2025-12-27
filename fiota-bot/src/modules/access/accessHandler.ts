import { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import db from '../../lib/db';
import { config } from '../../config';

export async function handleAccessButton(interaction: Interaction) {
    if (!interaction.isButton()) return;

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

        const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
        const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(chapterInput);
        const thirdActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(voucherInput);
        const fourthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(zipInput);
        const fifthActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(industryInput);

        modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow, fifthActionRow);

        await interaction.showModal(modal);
    } 
    
    if (interaction.customId === 'verify_guest_start') {
        await interaction.reply({ content: 'LinkedIn Verification Link: [Click Here](https://linkedin.com) (Stub)', ephemeral: true });
    }
    
    // Handle Approval Button logic here (Task 3.4)
    if (interaction.customId.startsWith('approve_ticket_')) {
        const ticketId = interaction.customId.split('_')[2];
        const approver = interaction.user;
        
        // Transaction to prevent race condition
        const processApproval = db.transaction(() => {
            const currentTicket = db.prepare('SELECT * FROM verification_tickets WHERE ticket_id = ?').get(ticketId) as any;
            
            if (!currentTicket) return { success: false, msg: 'Ticket not found.' };
            if (currentTicket.status === 'VERIFIED') return { success: false, msg: 'User already verified.' };
            
            if (currentTicket.voucher_1 === approver.id || currentTicket.voucher_2 === approver.id) {
                return { success: false, msg: 'You have already approved this ticket.' };
            }

            if (!currentTicket.voucher_1) {
                db.prepare('UPDATE verification_tickets SET voucher_1 = ?, status = ? WHERE ticket_id = ?').run(approver.id, 'PENDING_2', ticketId);
                return { success: true, status: '1/2' };
            } else {
                db.prepare('UPDATE verification_tickets SET voucher_2 = ?, status = ? WHERE ticket_id = ?').run(approver.id, 'VERIFIED', ticketId);
                db.prepare('UPDATE users SET status = ? WHERE discord_id = ?').run('BROTHER', currentTicket.user_id);
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
             // Grant Role
             const guild = interaction.guild;
             const member = await guild?.members.fetch(result.userId);
             // Note: Role name must match exactly what is in Discord
             const brotherRole = guild?.roles.cache.find(r => r.name === '🦁 ΓΠ Brother');
             
             if (member && brotherRole) {
                 await member.roles.add(brotherRole);
                 await interaction.reply({ content: `✅✅ Second approval recorded! **${member.user.username}** is now Verified and has the Brother role.`, ephemeral: false });
             } else {
                 await interaction.reply({ content: `✅ Verified (Database updated), but failed to assign Discord Role. Check logs.`, ephemeral: true });
                 console.error('[Access] Role assignment failed. Member or Role not found.');
             }
        }
    }
}

export async function handleAccessModal(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'verify_brother_modal') {
        const realName = interaction.fields.getTextInputValue('real_name');
        const chapter = interaction.fields.getTextInputValue('chapter_init');
        const voucher = interaction.fields.getTextInputValue('voucher_name');
        const zip = interaction.fields.getTextInputValue('zip_code');
        const industry = interaction.fields.getTextInputValue('industry');

        const userId = interaction.user.id;
        const ticketId = `ticket_${userId}_${Date.now()}`;

        // Save to DB
        const insertUser = db.prepare(`
            INSERT OR REPLACE INTO users (discord_id, real_name, zip_code, industry) 
            VALUES (?, ?, ?, ?)
        `);
        insertUser.run(userId, realName, zip, industry);

        const insertTicket = db.prepare(`
            INSERT INTO verification_tickets (ticket_id, user_id, status)
            VALUES (?, ?, 'PENDING')
        `);
        insertTicket.run(ticketId, userId);

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
                channel.send({ embeds: [embed], components: [row] });
            } else {
                console.error(`[Access] Could not find Verification Channel: ${adminChannelId}`);
            }
        }
    }
}