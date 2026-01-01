/**
 * AUDIT MODULE - Server Requirements
 *
 * Roles and channels needed for:
 * - Server compliance auditing
 * - Golden State enforcement
 */

import { ChannelType } from 'discord.js';
import { registerRequirements, ChannelRequirement } from '../../lib/serverRequirements';

export const AUDIT_ROLES = [
    '🦁 E-Board'  // Can run /audit and /setup
];

export const AUDIT_CHANNELS: ChannelRequirement[] = [
    { name: 'audit-log', type: ChannelType.GuildText },
    { name: 'announcements', type: ChannelType.GuildText }
];

registerRequirements('audit', {
    roles: AUDIT_ROLES,
    channels: AUDIT_CHANNELS
});
