import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    PermissionFlagsBits
} from 'discord.js';
import { ticketRepository } from '../lib/repositories/ticketRepository';
import { userRepository } from '../lib/repositories/userRepository';
import { getDisplayName } from '../lib/displayNameBuilder';
import logger from '../lib/logger';

export default {
    data: new SlashCommandBuilder()
        .setName('verify-override')
        .setDescription('E-Board: Override a verification ticket and immediately verify a user')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName('ticket_id')
                .setDescription('Select a pending verification ticket')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('Reason for override (logged for audit)')
                .setRequired(true)
        ),

    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const pendingTickets = ticketRepository.getPendingTickets();

        const options = pendingTickets
            .map(ticket => {
                const user = userRepository.getByDiscordId(ticket.user_id);
                const displayName = user ? getDisplayName(user, 'full') : `User ${ticket.user_id}`;
                const statusLabel = ticket.status === 'PENDING_2' ? ' [1/2]' : '';

                return {
                    name: `${displayName}${statusLabel}`.substring(0, 100),
                    value: ticket.ticket_id,
                    searchable: `${displayName} ${ticket.ticket_id}`.toLowerCase()
                };
            })
            .filter(opt => opt.searchable.includes(focusedValue))
            .slice(0, 25);

        await interaction.respond(
            options.map(({ name, value }) => ({ name, value }))
        );
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const ticketId = interaction.options.getString('ticket_id', true);
        const reason = interaction.options.getString('reason', true);
        const overrider = interaction.user;

        // Get ticket
        const ticket = ticketRepository.getById(ticketId);
        if (!ticket) {
            await interaction.reply({
                content: `Ticket not found: \`${ticketId}\``,
                ephemeral: true
            });
            return;
        }

        // Check ticket status
        if (ticket.status === 'VERIFIED' || ticket.status === 'OVERRIDDEN') {
            await interaction.reply({
                content: `Ticket \`${ticketId}\` has already been verified.`,
                ephemeral: true
            });
            return;
        }

        // Override the ticket
        ticketRepository.override(ticketId, overrider.id);
        userRepository.updateStatus(ticket.user_id, 'BROTHER');

        logger.info(`[Access] E-Board Override: ${overrider.tag} (${overrider.id}) overrode ticket ${ticketId}. Reason: ${reason}`);

        // Assign brother role
        const guild = interaction.guild;
        if (guild) {
            try {
                const member = await guild.members.fetch(ticket.user_id);
                const brotherRole = guild.roles.cache.find(r => r.name === '🦁 ΓΠ Brother');

                if (member && brotherRole) {
                    await member.roles.add(brotherRole);
                    await interaction.reply({
                        content: `**E-Board Override Applied**\n\nTicket: \`${ticketId}\`\nUser: <@${ticket.user_id}>\nOverridden by: <@${overrider.id}>\nReason: ${reason}\n\n**${member.user.username}** has been verified and granted the Brother role.`,
                        ephemeral: false
                    });
                } else {
                    await interaction.reply({
                        content: `**E-Board Override Applied**\n\nTicket: \`${ticketId}\`\nUser: <@${ticket.user_id}>\n\nUser verified in database but role assignment failed. Please manually assign the Brother role.`,
                        ephemeral: true
                    });
                    logger.error(`[Access] Override role assignment failed for ${ticket.user_id}`);
                }
            } catch (error) {
                await interaction.reply({
                    content: `**E-Board Override Applied**\n\nTicket: \`${ticketId}\`\n\nDatabase updated but could not fetch member. They may have left the server.`,
                    ephemeral: true
                });
                logger.error(`[Access] Override member fetch failed for ${ticket.user_id}:`, error);
            }
        } else {
            await interaction.reply({
                content: `**E-Board Override Applied**\n\nTicket: \`${ticketId}\` has been overridden.`,
                ephemeral: true
            });
        }
    }
};
