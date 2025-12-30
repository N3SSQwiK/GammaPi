// The Golden State Configuration
import { ChannelType } from 'discord.js';

export interface ExpectedChannel {
    name: string;
    type: ChannelType;
    tags?: string[];
    guidelines?: string;
    defaultReaction?: string;
    requireTag?: boolean;
}

export const EXPECTED_ROLES = [
    '🦁 E-Board',
    '🦁 Line Committee',
    '🦁 ΓΠ Brother',
    '🦁 Visiting Brother',
    '🦁 Brother at Large',
    '👔 Candidate',
    '🌍 Guest',
    '✅ Rules Accepted'
];

export const FORBIDDEN_EVERYONE_PERMS = [
    'Administrator',
    'ManageRoles',
    'ManageChannels',
    'KickMembers',
    'BanMembers'
];

export const EXPECTED_CHANNELS: ExpectedChannel[] = [
    // Public
    { name: 'announcements', type: ChannelType.GuildText },
    { name: 'rules-and-conduct', type: ChannelType.GuildText },
    { name: 'welcome-gate', type: ChannelType.GuildText },
    
    // Forums
    { 
        name: 'career-center', 
        type: ChannelType.GuildForum, 
        tags: ['💼 Hiring', '👀 Seeking', '📍 Remote'],
        guidelines: "Post job opportunities or ask for career advice. Use tags to help brothers filter.",
        defaultReaction: '💼',
        requireTag: true
    },
    { 
        name: 'lions-den', 
        type: ChannelType.GuildForum, 
        tags: ['👋 My Life', '🏋️ Fitness', '👨‍💻 Projects', '🎮 Gaming', '🍳 Food', '🤝 Philanthropy', '📚 Education', '💪 Training'],
        guidelines: "Create ONE thread to serve as your personal blog/feed. Share updates on your life, projects, or fitness journey. Follow other brothers to stay connected.",
        defaultReaction: '🦁',
        requireTag: true
    },
    {
        name: 'tech-support',
        type: ChannelType.GuildForum,
        tags: ['🐛 Bug', '✨ Feature'],
        guidelines: "Report bugs or suggest features for FiotaBot.",
        defaultReaction: '🐛',
        requireTag: true
    }
];