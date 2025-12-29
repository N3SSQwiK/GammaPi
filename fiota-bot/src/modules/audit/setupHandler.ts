import { Guild, ChannelType, ForumChannel, ChannelFlags, GuildForumTagData } from 'discord.js';
import { EXPECTED_ROLES, EXPECTED_CHANNELS, ExpectedChannel } from './serverConfig';

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
                    topic: expected.guidelines,
                    defaultReactionEmoji: expected.defaultReaction ? { name: expected.defaultReaction, id: null } : undefined,
                    reason: 'FiotaBot Setup: Initializing Golden State'
                });
                
                report.push(`✅ Created Channel: #${expected.name}`);
                found = newChannel;

                // Set flags if needed
                if (found && expected.requireTag && found.type === ChannelType.GuildForum) {
                    await (found as ForumChannel).edit({ flags: [ChannelFlags.RequireTag] });
                }
            } catch (e) {
                report.push(`❌ Failed to create Channel #${expected.name}: ${e}`);
            }
        } else {
            // Update existing Forum Guidelines/Reaction if needed
            if (found.type === ChannelType.GuildForum) {
                const forum = found as ForumChannel;
                let updateData: any = {};

                if (expected.guidelines && forum.topic !== expected.guidelines) {
                    updateData.topic = expected.guidelines;
                }

                if (expected.requireTag && !forum.flags.has(ChannelFlags.RequireTag)) {
                    updateData.flags = [ChannelFlags.RequireTag];
                }
                
                if (Object.keys(updateData).length > 0) {
                    await forum.edit(updateData);
                    report.push(`✅ Updated settings for #${expected.name}`);
                }
            }
        }

        // 3. Forum Tags Setup (Only if channel exists/was created)
        if (found && found.type === ChannelType.GuildForum && expected.tags) {
            const forum = found as ForumChannel;
            const existingTags = forum.availableTags;
            const existingTagNames = existingTags.map(t => t.name);
            const tagsToAdd: GuildForumTagData[] = [];

            for (const tagName of expected.tags) {
                if (!existingTagNames.includes(tagName)) {
                    tagsToAdd.push({ name: tagName });
                }
            }

            if (tagsToAdd.length > 0) {
                try {
                    // Combine existing tags with new ones
                    const newTagSet: GuildForumTagData[] = [
                        ...existingTags.map(t => ({
                            name: t.name,
                            emojiId: t.emoji?.id || undefined,
                            emojiName: t.emoji?.name || undefined,
                            moderated: t.moderated
                        })), 
                        ...tagsToAdd
                    ];
                    
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