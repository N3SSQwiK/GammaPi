import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField, ChannelType, GuildChannel, ForumChannel, Guild, TextChannel, ChannelFlags } from 'discord.js';
import { EXPECTED_ROLES, EXPECTED_CHANNELS, FORBIDDEN_EVERYONE_PERMS } from './serverConfig';
import { config } from '../../config';
import logger from '../../lib/logger';

/**
 * Core Audit Logic: Performs the validation and returns the Embed
 */
export async function performAudit(guild: Guild): Promise<EmbedBuilder> {
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
        .setColor(issues === 0 ? 0x00FF00 : 0xFF0000)
        .setDescription(report.length > 0 ? report.join('\n').substring(0, 4000) : '✅ **All Systems Nominal.** Server configuration matches the Spec.')
        .setTimestamp();

    return embed;
}

/**
 * Handler for the /audit Slash Command
 */
export async function runAudit(interaction: ChatInputCommandInteraction) {
    const guild = interaction.guild;
    if (!guild) return;

    await interaction.deferReply();
    const embed = await performAudit(guild);
    await interaction.editReply({ embeds: [embed] });
}

/**
 * Automated Audit Trigger (called by scheduler)
 */
export async function runAutomatedAudit(guild: Guild) {
    if (!config.AUDIT_CHANNEL_ID) {
        logger.warn('[Audit] Automation skipped: No AUDIT_CHANNEL_ID configured.');
        return;
    }

    const channel = await guild.channels.fetch(config.AUDIT_CHANNEL_ID) as TextChannel;
    if (!channel) {
        logger.error(`[Audit] Automation error: Could not find channel ${config.AUDIT_CHANNEL_ID}`);
        return;
    }

    const embed = await performAudit(guild);
    await channel.send({ content: '📊 **Weekly Scheduled Security Audit**', embeds: [embed] });
}