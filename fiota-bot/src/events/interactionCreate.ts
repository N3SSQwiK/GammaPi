import { Events, Interaction } from 'discord.js';
import { handleAccessButton, handleAccessModal, handleVerificationModals, handleProfileUpdateModal, handleBootstrapModal } from '../modules/access/accessHandler';
import { handleRulesButton } from '../modules/access/rulesHandler';
import logger from '../lib/logger';

export default {
    name: Events.InteractionCreate,
    async execute(interaction: Interaction) {
        // Handle Autocomplete
        if (interaction.isAutocomplete()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command || !command.autocomplete) {
                return;
            }
            try {
                await command.autocomplete(interaction);
            } catch (error) {
                logger.error(`Error in autocomplete for ${interaction.commandName}:`, error);
            }
            return;
        }

        // Handle Slash Commands
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
            // Handle new verification modals (verify_modal_1, verify_modal_2)
            if (interaction.customId.startsWith('verify_modal_')) {
                await handleVerificationModals(interaction);
                return;
            }
            // Handle bootstrap modal (founding brother registration)
            if (interaction.customId.startsWith('bootstrap_modal_')) {
                await handleBootstrapModal(interaction);
                return;
            }
            // Handle profile update modal
            if (interaction.customId === 'profile_update_modal') {
                await handleProfileUpdateModal(interaction);
                return;
            }
            // Handle legacy Access Modals
            await handleAccessModal(interaction);
        }
    },
};
