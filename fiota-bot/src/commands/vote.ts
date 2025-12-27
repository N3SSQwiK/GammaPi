import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Create a simple poll')
        .addStringOption(option => 
            option.setName('topic')
            .setDescription('The question to vote on')
            .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const topic = interaction.options.getString('topic', true);

        const embed = new EmbedBuilder()
            .setTitle('🗳️ Vote: ' + topic)
            .setDescription('React below to cast your vote.\n\n✅ = Yes\n❌ = No\n🤷 = Abstain')
            .setTimestamp();

        const message = await interaction.reply({ embeds: [embed], fetchReply: true });
        
        await message.react('✅');
        await message.react('❌');
        await message.react('🤷');
    },
};