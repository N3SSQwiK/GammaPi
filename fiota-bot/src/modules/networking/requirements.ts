/**
 * NETWORKING MODULE - Server Requirements
 *
 * Roles and channels needed for:
 * - Professional Rolodex (/find)
 * - Mentorship program (/mentor)
 * - Career networking
 */

import { ChannelType } from 'discord.js';
import { registerRequirements, ChannelRequirement } from '../../lib/serverRequirements';

export const NETWORKING_ROLES = [
    '🧠 Open to Mentor'  // Brothers available for mentorship
];

export const NETWORKING_CHANNELS: ChannelRequirement[] = [
    {
        name: 'career-center',
        type: ChannelType.GuildForum,
        tags: ['💼 Hiring', '👀 Seeking', '📍 Remote'],
        guidelines: 'Post job opportunities or ask for career advice. Use tags to help brothers filter.',
        defaultReaction: '💼',
        requireTag: true
    }
];

registerRequirements('networking', {
    roles: NETWORKING_ROLES,
    channels: NETWORKING_CHANNELS
});
