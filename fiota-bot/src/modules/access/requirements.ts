/**
 * ACCESS MODULE - Server Requirements
 *
 * Roles and channels needed for:
 * - Rules agreement flow
 * - Brother/Guest verification
 * - Bootstrap command
 *
 * Channel visibility hierarchy:
 * - #rules-and-conduct: @everyone can see (entry point)
 * - #welcome-gate: Only ✅ Rules Accepted can see
 * - #verification-requests: Only 🦁 E-Board can see
 */

import { ChannelType, PermissionFlagsBits } from 'discord.js';
import { registerRequirements, ChannelRequirement } from '../../lib/serverRequirements';

export const ACCESS_ROLES = [
    '🦁 ΓΠ Brother',        // Verified brothers
    '🦁 Visiting Brother',  // Brothers from other chapters
    '🌍 Guest',             // Non-brothers (prospective, family, etc.)
    '✅ Rules Accepted'     // Agreed to Code of Conduct (gates #welcome-gate)
];

export const ACCESS_CHANNELS: ChannelRequirement[] = [
    {
        name: 'rules-and-conduct',
        type: ChannelType.GuildText,
        // @everyone CAN see this (entry point for all new users)
        // No overwrites needed - inherits default permissions
    },
    {
        name: 'welcome-gate',
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                // Hide from @everyone by default
                roleOrMember: '@everyone',
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                // Only ✅ Rules Accepted can see
                roleOrMember: '✅ Rules Accepted',
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
            }
        ]
    },
    {
        name: 'verification-requests',
        type: ChannelType.GuildText,
        permissionOverwrites: [
            {
                // Hide from @everyone
                roleOrMember: '@everyone',
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                // Only E-Board can see verification requests
                roleOrMember: '🦁 E-Board',
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.SendMessages]
            },
            {
                // Brothers can also see (to approve verifications)
                roleOrMember: '🦁 ΓΠ Brother',
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
            }
        ]
    }
];

// Register with the central registry
registerRequirements('access', {
    roles: ACCESS_ROLES,
    channels: ACCESS_CHANNELS
});
