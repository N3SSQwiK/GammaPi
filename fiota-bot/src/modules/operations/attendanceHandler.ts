import { ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, TextChannel } from 'discord.js';
import { attendanceRepository } from '../../lib/repositories/attendanceRepository';

export async function handleAttendance(interaction: ChatInputCommandInteraction) {
    const duration = interaction.options.getInteger('duration', true);
    const meetingId = attendanceRepository.create('Chapter Meeting');

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`attend_${meetingId}`)
                .setLabel('Check In Here')
                .setStyle(ButtonStyle.Success)
        );

    await interaction.reply({ content: `📢 Attendance Open for **${duration} minutes**! Click below to check in.`, components: [row] });

    const collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, time: duration * 60 * 1000 });

    collector?.on('collect', async i => {
        if (i.customId === `attend_${meetingId}`) {
            const userId = i.user.id;
            const meeting = attendanceRepository.getById(meetingId);
            
            if (!meeting) {
                await i.reply({ content: 'Error: Meeting not found.', ephemeral: true });
                return;
            }

            let attendees: string[] = JSON.parse(meeting.attendees || '[]');

            if (attendees.includes(userId)) {
                 await i.reply({ content: 'You have already checked in!', ephemeral: true });
                 return;
            }

            attendees.push(userId);
            attendanceRepository.updateAttendees(meetingId, attendees);

            await i.reply({ content: '✅ Checked in! Your attendance has been recorded.', ephemeral: true });
        }
    });

    collector?.on('end', async () => {
         await interaction.followUp({ content: `🛑 Attendance Closed. Meeting ID: ${meetingId}.` });
    });
}
