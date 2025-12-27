import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { userRepository } from '../lib/repositories/userRepository';

export default {
    data: new SlashCommandBuilder()
        .setName('mentor')
        .setDescription('Toggle your Mentorship status')
        .addStringOption(option => 
            option.setName('status')
            .setDescription('Are you open to mentoring?')
            .setRequired(true)
            .addChoices(
                { name: 'Open to Mentor', value: 'ON' },
                { name: 'Unavailable', value: 'OFF' }
            )),
    async execute(interaction: ChatInputCommandInteraction) {
        const status = interaction.options.getString('status', true);
        const isMentor = status === 'ON';
        const userId = interaction.user.id;

        const user = userRepository.getByDiscordId(userId);
        if (!user) {
            userRepository.upsert({ discord_id: userId, is_mentor: isMentor ? 1 : 0 });
        } else {
            userRepository.updateMentorship(userId, isMentor);
        }

        // Add/Remove Role (Stub)
        // const role = interaction.guild?.roles.cache.find(r => r.name === '🧠 Open to Mentor');
        // if (role) { ... }

        await interaction.reply({ content: `✅ Mentorship status updated to: **${status}**.`, ephemeral: true });
    },
};