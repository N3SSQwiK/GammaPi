import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import db from '../lib/db';

export default {
    data: new SlashCommandBuilder()
        .setName('attendance')
        .setDescription('Starts an attendance session')
        .addIntegerOption(option => 
            option.setName('duration')
            .setDescription('Duration in minutes')
            .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const duration = interaction.options.getInteger('duration', true);
        const endTime = Date.now() + (duration * 60 * 1000);
        
        // Create meeting entry in DB
        const stmt = db.prepare('INSERT INTO attendance (date, topic, attendees) VALUES (?, ?, ?)');
        const info = stmt.run(new Date().toISOString(), 'Chapter Meeting', '[]');
        const meetingId = info.lastInsertRowid;

        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`attend_${meetingId}`)
                    .setLabel('Check In Here')
                    .setStyle(ButtonStyle.Success)
            );

        await interaction.reply({ content: `📢 Attendance Open for **${duration} minutes**! Click below to check in.`, components: [row] });

        // Collector Logic
        const collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, time: duration * 60 * 1000 });

        collector?.on('collect', async i => {
            if (i.customId === `attend_${meetingId}`) {
                const userId = i.user.id;
                
                // Fetch current list
                const currentMeeting = db.prepare('SELECT attendees FROM attendance WHERE meeting_id = ?').get(meetingId) as any;
                let attendees: string[] = [];
                try {
                    attendees = JSON.parse(currentMeeting.attendees || '[]');
                } catch (e) { attendees = []; }

                if (attendees.includes(userId)) {
                     await i.reply({ content: 'You have already checked in!', ephemeral: true });
                     return;
                }

                attendees.push(userId);
                db.prepare('UPDATE attendance SET attendees = ? WHERE meeting_id = ?').run(JSON.stringify(attendees), meetingId);

                await i.reply({ content: '✅ Checked in! Your attendance has been recorded.', ephemeral: true });
            }
        });

        collector?.on('end', async () => {
             // Generate Report (Stub)
             interaction.followUp({ content: `🛑 Attendance Closed. Meeting ID: ${meetingId}.` });
        });
    },
};
