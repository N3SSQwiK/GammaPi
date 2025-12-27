import { ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';

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

    const votes = new Map<string, string>(); // userId -> choice

    const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 24 * 60 * 60 * 1000 }); // 24 hours

    collector.on('collect', async i => {
        votes.set(i.user.id, i.customId);

        const counts = { yes: 0, no: 0, abstain: 0 };
        votes.forEach(choice => {
            if (choice === 'vote_yes') counts.yes++;
            if (choice === 'vote_no') counts.no++;
            if (choice === 'vote_abstain') counts.abstain++;
        });

        const newDescription = `Cast your vote using the buttons below.\n\n✅ Yes: ${counts.yes}\n❌ No: ${counts.no}\n🤷 Abstain: ${counts.abstain}`;
        
        const updatedEmbed = EmbedBuilder.from(embed).setDescription(newDescription);
        
        await i.update({ embeds: [updatedEmbed] });
    });
}
