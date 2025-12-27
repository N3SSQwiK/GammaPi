import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import { voteRepository } from '../../lib/repositories/voteRepository';

export async function handleVote(interaction: ChatInputCommandInteraction) {
    const topic = interaction.options.getString('topic', true);

    const embed = new EmbedBuilder()
        .setTitle('🗳️ Vote: ' + topic)
        .setDescription('Cast your vote using the buttons below.\n\n✅ Yes: 0\n❌ No: 0\n🤷 Abstain: 0')
        .setTimestamp();

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('vote_yes').setLabel('Yes').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('vote_no').setLabel('No').setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId('vote_abstain').setLabel('Abstain').setStyle(ButtonStyle.Secondary)
    );

    const message = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
    const pollId = message.id;

    const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 24 * 60 * 60 * 1000 }); // 24 hours

    collector.on('collect', async i => {
        voteRepository.saveVote(pollId, i.user.id, i.customId);
        const counts = voteRepository.getCounts(pollId);

        const newDescription = `Cast your vote using the buttons below.\n\n✅ Yes: ${counts.yes}\n❌ No: ${counts.no}\n🤷 Abstain: ${counts.abstain}`;
        
        const updatedEmbed = EmbedBuilder.from(embed).setDescription(newDescription);
        
        await i.update({ embeds: [updatedEmbed] });
    });
}
