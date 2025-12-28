import { Guild, ChannelType, ForumChannel } from 'discord.js';
import { EXPECTED_ROLES, EXPECTED_CHANNELS } from './serverConfig';

export async function runSetup(guild: Guild): Promise<string[]> {
    const report: string[] = [];

    // 1. Roles Setup
    const roles = await guild.roles.fetch();
    for (const roleName of EXPECTED_ROLES) {
        const found = roles.find(r => r.name === roleName);
        if (!found) {
            try {
                await guild.roles.create({
                    name: roleName,
                    reason: 'FiotaBot Setup: Initializing Golden State'
                });
                report.push(`✅ Created Role: ${roleName}`);
            } catch (e) {
                report.push(`❌ Failed to create Role ${roleName}: ${e}`);
            }
        } else {
            // report.push(`ℹ️ Role ${roleName} already exists.`);
        }
    }

    // 2. Channels Setup
    const channels = await guild.channels.fetch();
    for (const expected of EXPECTED_CHANNELS) {
        let found = channels.find(c => c && c.name === expected.name);
        
        if (!found) {
            try {
                const newChannel = await guild.channels.create({
                    name: expected.name,
                    type: expected.type as any,
                    topic: (expected as any).guidelines,
                    defaultReactionEmoji: (expected as any).defaultReaction ? { name: (expected as any).defaultReaction, id: null } : undefined,
                    reason: 'FiotaBot Setup: Initializing Golden State'
                });
                report.push(`✅ Created Channel: #${expected.name}`);
                found = newChannel;
            } catch (e) {
                report.push(`❌ Failed to create Channel #${expected.name}: ${e}`);
            }
        } else {
            // Update existing Forum Guidelines/Reaction if needed
            if (found.type === ChannelType.GuildForum) {
                const forum = found as ForumChannel;
                const expectedGuidelines = (expected as any).guidelines;
                const expectedReaction = (expected as any).defaultReaction;

                if (expectedGuidelines && forum.topic !== expectedGuidelines) {
                    await forum.setTopic(expectedGuidelines);
                    report.push(`✅ Updated Guidelines for #${expected.name}`);
                }
                
                // Note: Updating defaultReactionEmoji is complex because it requires exact emoji format/ID match. 
                // Skipping "Update" logic for reaction to avoid API errors on existing channels.
            }
        }

        // 3. Forum Tags Setup (Only if channel exists/was created)
        if (found && found.type === ChannelType.GuildForum && expected.tags) {
            const forum = found as ForumChannel;
            const existingTags = forum.availableTags;
            const existingTagNames = existingTags.map(t => t.name);
            const tagsToAdd: any[] = [];

            for (const tag of expected.tags) {
                if (!existingTagNames.includes(tag)) {
                    tagsToAdd.push({ name: tag });
                }
            }

            if (tagsToAdd.length > 0) {
                try {
                    // We must provide ALL tags (existing + new) to setAvailableTags
                    // But actually, setAvailableTags accepts the new array.
                    // Let's just append.
                    const newTagSet = [...existingTags, ...tagsToAdd];
                    await forum.setAvailableTags(newTagSet);
                    report.push(`✅ Added ${tagsToAdd.length} tags to #${expected.name}`);
                } catch (e) {
                    report.push(`❌ Failed to add tags to #${expected.name}: ${e}`);
                }
            }
        }
    }

    if (report.length === 0) {
        report.push('✨ Server is already in the Golden State. No changes made.');
    }

    return report;
}