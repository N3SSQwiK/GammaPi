/**
 * COMMUNITY MODULE - Server Requirements
 *
 * Channels for general brotherhood engagement:
 * - Lions Den (personal blogs)
 * - Tech Support (bot feedback)
 */

import { ChannelType } from 'discord.js';
import { registerRequirements, ChannelRequirement } from '../../lib/serverRequirements';

export const COMMUNITY_ROLES: string[] = [];

export const COMMUNITY_CHANNELS: ChannelRequirement[] = [
    {
        name: 'lions-den',
        type: ChannelType.GuildForum,
        tags: ['👋 My Life', '🏋️ Fitness', '👨‍💻 Projects', '🎮 Gaming', '🍳 Food', '🤝 Philanthropy', '📚 Education', '💪 Training'],
        guidelines: 'Create ONE thread to serve as your personal blog/feed. Share updates on your life, projects, or fitness journey. Follow other brothers to stay connected.',
        defaultReaction: '🦁',
        requireTag: true
    },
    {
        name: 'tech-support',
        type: ChannelType.GuildForum,
        tags: ['🐛 Bug', '✨ Feature'],
        guidelines: 'Report bugs or suggest features for FiotaBot.',
        defaultReaction: '🐛',
        requireTag: true
    }
];

registerRequirements('community', {
    roles: COMMUNITY_ROLES,
    channels: COMMUNITY_CHANNELS
});
