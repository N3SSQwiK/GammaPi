import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { handleVote } from '../modules/operations/voteHandler';

export default {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Create a simple poll')
        .addStringOption(option => 
            option.setName('topic')
            .setDescription('The question to vote on')
            .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        await handleVote(interaction);
    },
};
