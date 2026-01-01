/**
 * SERVER REQUIREMENTS REGISTRY
 *
 * This module provides a pattern for features to declare their required
 * server structure (roles, channels) alongside their implementation.
 *
 * Usage in feature files:
 *   import { registerRequirements } from '../lib/serverRequirements';
 *   registerRequirements('mentor', {
 *       roles: ['🧠 Open to Mentor'],
 *       channels: []
 *   });
 *
 * The serverConfig.ts then aggregates all registered requirements.
 */

import { ChannelType } from 'discord.js';

export interface ChannelRequirement {
    name: string;
    type: ChannelType;
    tags?: string[];
    guidelines?: string;
    defaultReaction?: string;
    requireTag?: boolean;
}

export interface FeatureRequirements {
    roles?: string[];
    channels?: ChannelRequirement[];
}

// Registry of all feature requirements
const requirementsRegistry = new Map<string, FeatureRequirements>();

/**
 * Register server requirements for a feature
 * Call this at module load time in each feature file
 */
export function registerRequirements(featureName: string, requirements: FeatureRequirements): void {
    requirementsRegistry.set(featureName, requirements);
}

/**
 * Get all registered requirements aggregated
 * Used by serverConfig.ts to build the Golden State
 */
export function getAggregatedRequirements(): { roles: string[]; channels: ChannelRequirement[] } {
    const allRoles = new Set<string>();
    const allChannels = new Map<string, ChannelRequirement>();

    for (const [featureName, reqs] of requirementsRegistry) {
        // Collect roles (deduplicated via Set)
        if (reqs.roles) {
            for (const role of reqs.roles) {
                allRoles.add(role);
            }
        }

        // Collect channels (deduplicated by name, later definition wins)
        if (reqs.channels) {
            for (const channel of reqs.channels) {
                allChannels.set(channel.name, channel);
            }
        }
    }

    return {
        roles: Array.from(allRoles),
        channels: Array.from(allChannels.values())
    };
}

/**
 * Get requirements grouped by feature (for debugging/auditing)
 */
export function getRequirementsByFeature(): Map<string, FeatureRequirements> {
    return new Map(requirementsRegistry);
}
