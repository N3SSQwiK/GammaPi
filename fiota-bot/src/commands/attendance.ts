import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { handleAttendance } from '../modules/operations/attendanceHandler';

export default {
    data: new SlashCommandBuilder()
        .setName('attendance')
        .setDescription('Starts an attendance session')
        .addIntegerOption(option => 
            option.setName('duration')
            .setDescription('Duration in minutes')
            .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await handleAttendance(interaction);
    },
};