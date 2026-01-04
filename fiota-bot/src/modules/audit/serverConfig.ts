/**
 * THE GOLDEN STATE CONFIGURATION
 *
 * This file aggregates server requirements from all feature modules.
 * Each module declares its own roles/channels in a requirements.ts file,
 * ensuring the config stays in sync with the code that uses it.
 *
 * To add new requirements:
 * 1. Create/update requirements.ts in your module folder
 * 2. Import it below to register it
 * 3. The Golden State automatically includes your requirements
 */

import { ChannelType } from 'discord.js';
import { getAggregatedRequirements, ChannelRequirement } from '../../lib/serverRequirements';

// ============================================================================
// IMPORT ALL MODULE REQUIREMENTS
// Each import triggers registerRequirements() for that module
// ============================================================================

import '../access/requirements';
import '../networking/requirements';
import '../pipeline/requirements';
import '../community/requirements';
import './requirements';  // audit module's own requirements

// ============================================================================
// TYPES
// ============================================================================

// Re-export ChannelRequirement as ExpectedChannel for backward compatibility
export type ExpectedChannel = ChannelRequirement;

// ============================================================================
// AGGREGATED GOLDEN STATE
// ============================================================================

// Get all requirements from registered modules
const aggregated = getAggregatedRequirements();

/**
 * All roles required by the bot across all features
 * Auto-aggregated from module requirements.ts files
 */
export const EXPECTED_ROLES: string[] = aggregated.roles;

/**
 * All channels required by the bot across all features
 * Auto-aggregated from module requirements.ts files
 */
export const EXPECTED_CHANNELS: ExpectedChannel[] = aggregated.channels;

// ============================================================================
// SECURITY CONSTRAINTS (not module-specific)
// ============================================================================

/**
 * Permissions that should NEVER be granted to @everyone
 */
export const FORBIDDEN_EVERYONE_PERMS = [
    'Administrator',
    'ManageRoles',
    'ManageChannels',
    'KickMembers',
    'BanMembers'
];

// ============================================================================
// DEBUG: Log what was aggregated (remove in production)
// ============================================================================

if (process.env.DEBUG_SERVER_CONFIG) {
    console.log('[ServerConfig] Aggregated roles:', EXPECTED_ROLES);
    console.log('[ServerConfig] Aggregated channels:', EXPECTED_CHANNELS.map(c => c.name));
}
