import { Events, Interaction } from 'discord.js';
import { handleAccessButton, handleAccessModal } from '../modules/access/accessHandler';
import { handleRulesButton } from '../modules/access/rulesHandler';
import logger from '../lib/logger';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                logger.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                logger.error(`Error executing ${interaction.commandName}:`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isButton()) {
            // Handle Rules Agreement Button
            if (interaction.customId === 'rules_agree') {
                await handleRulesButton(interaction);
                return;
            }
            // Handle Access Buttons
            await handleAccessButton(interaction);
        } else if (interaction.isModalSubmit()) {
            // Handle Access Modals
            await handleAccessModal(interaction);
        }
    },
};
