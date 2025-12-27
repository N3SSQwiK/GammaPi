import { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import db from '../../lib/db';

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

        // DB Logic: Check if already voted
        const stmt = db.prepare('SELECT * FROM verification_tickets WHERE ticket_id = ?');
        const ticket = stmt.get(ticketId) as any;

        if (!ticket) {
            await interaction.reply({ content: 'Ticket not found.', ephemeral: true });
            return;
        }

        if (ticket.voucher_1 === approver.id || ticket.voucher_2 === approver.id) {
            await interaction.reply({ content: 'You have already approved this ticket.', ephemeral: true });
            return;
        }

        if (!ticket.voucher_1) {
            db.prepare('UPDATE verification_tickets SET voucher_1 = ?, status = ? WHERE ticket_id = ?').run(approver.id, 'PENDING_2', ticketId);
            await interaction.reply({ content: `✅ First approval recorded for Ticket ${ticketId}. One more needed.`, ephemeral: true });
            // Update Embed (Not implemented in stub)
        } else {
            db.prepare('UPDATE verification_tickets SET voucher_2 = ?, status = ? WHERE ticket_id = ?').run(approver.id, 'VERIFIED', ticketId);
            // Grant Role Logic (Stub)
            await interaction.reply({ content: `✅✅ Second approval recorded! User has been Verified.`, ephemeral: true });
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

        // Notify Admin Channel (Stubbed Channel ID - User must replace)
        // In prod, fetch channel from config
        const adminChannelId = 'REPLACE_WITH_CHANNEL_ID'; 
        
        // Simulating sending to channel by just acknowledging for now
        // To really send, we need interaction.guild.channels.cache.get(...)
        
        await interaction.reply({ content: `Application Submitted! Ticket ID: ${ticketId}. Please wait for 2 brothers to verify you.`, ephemeral: true });
        
        // In a real bot, we would send this embed to the admin channel:
        /*
        const channel = interaction.guild?.channels.cache.get(adminChannelId) as TextChannel;
        if (channel) {
            const embed = new EmbedBuilder()
                .setTitle('New Verification Request')
                .addFields(
                    { name: 'User', value: `<@${userId}>` },
                    { name: 'Name', value: realName },
                    { name: 'Chapter', value: chapter },
                    { name: 'Voucher', value: voucher }
                );
            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(new ButtonBuilder().setCustomId(`approve_ticket_${ticketId}`).setLabel('Approve').setStyle(ButtonStyle.Success));
            channel.send({ embeds: [embed], components: [row] });
        }
        */
    }
}
