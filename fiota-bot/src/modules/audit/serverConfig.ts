// The Golden State Configuration
import { ChannelType } from 'discord.js';

export const EXPECTED_ROLES = [
    '🦁 E-Board',
    '🦁 Line Committee',
    '🦁 ΓΠ Brother',
    '🦁 Visiting Brother',
    '🦁 Brother at Large',
    '👔 Candidate',
    '🌍 Guest'
];

export const FORBIDDEN_EVERYONE_PERMS = [
    'Administrator',
    'ManageRoles',
    'ManageChannels',
    'KickMembers',
    'BanMembers'
];

export const EXPECTED_CHANNELS = [
    // Public
    { name: 'announcements', type: ChannelType.GuildText },
    { name: 'welcome-gate', type: ChannelType.GuildText },
    
    // Forums
    { 
        name: 'career-center', 
        type: ChannelType.GuildForum, 
        tags: ['💼 Hiring', '👀 Seeking', '📍 Remote'] 
    },
    { 
        name: 'lions-den', 
        type: ChannelType.GuildForum, 
        tags: ['👋 My Life', '🏋️ Fitness', '👨‍💻 Projects'] 
    },
    {
        name: 'tech-support',
        type: ChannelType.GuildForum,
        tags: ['🐛 Bug', '✨ Feature']
    }
];
