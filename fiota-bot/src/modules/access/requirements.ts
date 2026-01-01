/**
 * ACCESS MODULE - Server Requirements
 *
 * Roles and channels needed for:
 * - Rules agreement flow
 * - Brother/Guest verification
 * - Bootstrap command
 */

import { ChannelType } from 'discord.js';
import { registerRequirements, ChannelRequirement } from '../../lib/serverRequirements';

export const ACCESS_ROLES = [
    '🦁 ΓΠ Brother',        // Verified brothers
    '🦁 Visiting Brother',  // Brothers from other chapters
    '🌍 Guest',             // Non-brothers (prospective, family, etc.)
    '✅ Rules Accepted'     // Agreed to Code of Conduct (gates #welcome-gate)
];

export const ACCESS_CHANNELS: ChannelRequirement[] = [
    { name: 'rules-and-conduct', type: ChannelType.GuildText },
    { name: 'welcome-gate', type: ChannelType.GuildText },
    { name: 'verification-requests', type: ChannelType.GuildText }  // E-Board approval queue
];

// Register with the central registry
registerRequirements('access', {
    roles: ACCESS_ROLES,
    channels: ACCESS_CHANNELS
});
