/**
 * PIPELINE MODULE - Server Requirements
 *
 * Roles and channels needed for:
 * - Candidate tracking (/pipeline)
 * - Line crossing (/cross)
 * - Committee operations
 *
 * NOTE: This module is currently a stub. Requirements are defined
 * here for when the feature is fully implemented.
 */

import { ChannelType } from 'discord.js';
import { registerRequirements, ChannelRequirement } from '../../lib/serverRequirements';

export const PIPELINE_ROLES = [
    '🦁 Line Committee',    // Can manage pipeline
    '🦁 Brother at Large',  // Alumni/inactive brothers
    '👔 Candidate'          // Prospective members in process
];

export const PIPELINE_CHANNELS: ChannelRequirement[] = [
    // Uncomment when pipeline features are fully implemented:
    // { name: 'interview-schedule', type: ChannelType.GuildText },
    // { name: 'committee-logs', type: ChannelType.GuildText },
    // { name: 'application-reviews', type: ChannelType.GuildText }
];

registerRequirements('pipeline', {
    roles: PIPELINE_ROLES,
    channels: PIPELINE_CHANNELS
});
