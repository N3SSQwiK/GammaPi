import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, ChannelType, GuildChannel, ForumChannel } from 'discord.js';
import { EXPECTED_ROLES, EXPECTED_CHANNELS, FORBIDDEN_EVERYONE_PERMS } from './serverConfig';

export async function runAudit(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    const report: string[] = [];
    let issues = 0;

    // 1. Role Check
    const roles = await guild.roles.fetch();
    EXPECTED_ROLES.forEach(roleName => {
        const found = roles.find(r => r.name === roleName);
        if (!found) {
            report.push(`❌ **Missing Role:** 
${roleName}
`);
            issues++;
        }
    });

    // 2. Security Check (@everyone)
    const everyoneRole = guild.roles.everyone;
    FORBIDDEN_EVERYONE_PERMS.forEach(perm => {
        if (everyoneRole.permissions.has(perm as any)) {
            report.push(`🔴 **CRITICAL:** 
@everyone
 has 
${perm}
 permission!`);
            issues++;
        }
    });

    // 3. Channel Check
    const channels = await guild.channels.fetch();
    EXPECTED_CHANNELS.forEach(expected => {
        const found = channels.find(c => c && c.name === expected.name);
        if (!found) {
            report.push(`⚠️ **Missing Channel:** 
#${expected.name}
`);
            issues++;
        } else {
            if (found.type !== expected.type) {
                report.push(`⚠️ **Wrong Type:** 
#${expected.name}
 should be type 
${expected.type}
`);
                issues++;
            }
            
            // Forum Tag Check
            if (found.type === ChannelType.GuildForum && expected.tags) {
                const forum = found as ForumChannel;
                const existingTags = forum.availableTags.map(t => t.name);
                expected.tags.forEach(tag => {
                    if (!existingTags.includes(tag)) {
                        report.push(`🔸 **Missing Tag:** 
#${expected.name}
 missing 
${tag}
`);
                        issues++;
                    }
                });
            }
        }
    });

    const embed = new EmbedBuilder()
        .setTitle('🛡️ Server Audit Report')
        .setColor(issues === 0 ? '#00FF00' : '#FF0000')
        .setDescription(report.length > 0 ? report.join('\n') : '✅ **All Systems Nominal.** Server configuration matches the Spec.')
        .setTimestamp();

    await interaction.reply({ embeds: [embed] });
}
