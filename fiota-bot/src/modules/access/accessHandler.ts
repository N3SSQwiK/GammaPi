import { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, TextChannel, ModalSubmitInteraction } from 'discord.js';
import db from '../../lib/db';
import { config } from '../../config';
import { userRepository } from '../../lib/repositories/userRepository';
import { ticketRepository } from '../../lib/repositories/ticketRepository';
import logger from '../../lib/logger';
import { validateYearSemester, validatePhoneNumber, validateZipOrCity, validateName, normalizeName, normalizePhoneNumber } from '../../lib/validation';
import { getChapterByValue } from '../../lib/constants';
import { getDisplayName, formatChapterName } from '../../lib/displayNameBuilder';

// Temporary storage for multi-step modal data (in production, consider Redis or DB)
const pendingVerifications = new Map<string, {
    chapter: string;
    industry: string;
    firstName: string;
    lastName: string;
    donName: string;
    yearSemester: { year: number; semester: 'Spring' | 'Fall' };
    jobTitle: string;
    expiresAt: number;
}>();

// Clean up expired pending verifications every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of pendingVerifications) {
        if (value.expiresAt < now) {
            pendingVerifications.delete(key);
        }
    }
}, 5 * 60 * 1000);

// Helper to parse full name into first/last (temporary for legacy modal)
function parseFullName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
        return { firstName: parts[0], lastName: '' };
    }
    const lastName = parts.pop() || '';
    const firstName = parts.join(' ');
    return { firstName, lastName };
}

export async function handleAccessButton(interaction: Interaction) {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId === 'verify_brother_start') {
            const modal = new ModalBuilder()
                .setCustomId('verify_brother_modal')
                .setTitle('Brother Verification');

            const nameInput = new TextInputBuilder()
                .setCustomId('real_name')
                .setLabel("Full Legal Name")
                .setStyle(TextInputStyle.Short);

            const chapterInput = new TextInputBuilder()
                .setCustomId('chapter_init')
                .setLabel("Chapter & Year (e.g. Gamma Pi, 2010)")
                .setStyle(TextInputStyle.Short);

            const voucherInput = new TextInputBuilder()
                .setCustomId('voucher_name')
                .setLabel("Voucher Name (ΓΠ Brother)")
                .setStyle(TextInputStyle.Short);

            const zipInput = new TextInputBuilder()
                .setCustomId('zip_code')
                .setLabel("Zip Code")
                .setStyle(TextInputStyle.Short)
                .setMaxLength(5);
            
            const industryInput = new TextInputBuilder()
                 .setCustomId('industry')
                 .setLabel("Industry & Title")
                 .setStyle(TextInputStyle.Short)
                 .setPlaceholder("Tech / Software Engineer");

            modal.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(chapterInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(voucherInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(zipInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(industryInput)
            );

            await interaction.showModal(modal);
        } 
        
        if (interaction.customId === 'verify_guest_start') {
            await interaction.reply({ content: 'LinkedIn Verification Link: [Click Here](https://linkedin.com) (Stub)', ephemeral: true });
        }

        // Handle "Continue to Step 2" button from new verification flow
        if (interaction.customId.startsWith('verify_continue_')) {
            const pendingUserId = interaction.customId.replace('verify_continue_', '');
            const userId = interaction.user.id;

            // Verify this is the same user
            if (pendingUserId !== userId) {
                await interaction.reply({
                    content: 'This button is not for you.',
                    ephemeral: true
                });
                return;
            }

            // Check pending data exists
            const pendingData = pendingVerifications.get(userId);
            if (!pendingData) {
                await interaction.reply({
                    content: 'Your verification session has expired. Please start over with `/verify-start`.',
                    ephemeral: true
                });
                return;
            }

            // Show Modal 2
            const modal2 = new ModalBuilder()
                .setCustomId(`verify_modal_2_${userId}`)
                .setTitle('Verification - Step 2 of 2');

            const voucher1Input = new TextInputBuilder()
                .setCustomId('voucher_1')
                .setLabel('Voucher 1 (brother who knows you)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder('Don Phoenix or John Smith');

            const voucher2Input = new TextInputBuilder()
                .setCustomId('voucher_2')
                .setLabel('Voucher 2 (different brother)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder('Don Nexus or Jane Doe');

            const phoneInput = new TextInputBuilder()
                .setCustomId('phone')
                .setLabel('Phone Number')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder('(555) 123-4567');

            const zipCityInput = new TextInputBuilder()
                .setCustomId('zip_city')
                .setLabel('Zip Code or City (international)')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setPlaceholder('10001 or Toronto, Canada');

            modal2.addComponents(
                new ActionRowBuilder<TextInputBuilder>().addComponents(voucher1Input),
                new ActionRowBuilder<TextInputBuilder>().addComponents(voucher2Input),
                new ActionRowBuilder<TextInputBuilder>().addComponents(phoneInput),
                new ActionRowBuilder<TextInputBuilder>().addComponents(zipCityInput)
            );

            await interaction.showModal(modal2);
        }
        
        if (interaction.customId.startsWith('approve_ticket_')) {
            const ticketId = interaction.customId.split('_')[2];
            const approver = interaction.user;

            // Check if approver is a brother
            const approverUser = userRepository.getByDiscordId(approver.id);
            if (!approverUser || (approverUser.status !== 'BROTHER' && approverUser.status !== 'OFFICER')) {
                await interaction.reply({
                    content: 'Only verified brothers can approve verification requests.',
                    ephemeral: true
                });
                return;
            }

            // Get ticket and check approval permission
            const currentTicket = ticketRepository.getById(ticketId);
            if (!currentTicket) {
                await interaction.reply({ content: 'Ticket not found.', ephemeral: true });
                return;
            }

            // Use new canApprove logic with 48hr fallback
            const canApproveResult = ticketRepository.canApprove(currentTicket, approver.id);
            if (!canApproveResult.allowed) {
                await interaction.reply({
                    content: canApproveResult.reason || 'You cannot approve this ticket.',
                    ephemeral: true
                });
                return;
            }

            // Process approval
            const processApproval = db.transaction(() => {
                // Re-fetch ticket in transaction to avoid race conditions
                const ticket = ticketRepository.getById(ticketId);
                if (!ticket) return { success: false, msg: 'Ticket not found.' };
                if (ticket.status === 'VERIFIED' || ticket.status === 'OVERRIDDEN') {
                    return { success: false, msg: 'User already verified.' };
                }

                if (!ticket.voucher_1) {
                    ticketRepository.recordFirstApproval(ticketId, approver.id);
                    return { success: true, status: '1/2' };
                } else {
                    ticketRepository.recordSecondApproval(ticketId, approver.id);
                    userRepository.updateStatus(ticket.user_id, 'BROTHER');
                    return { success: true, status: 'VERIFIED', userId: ticket.user_id };
                }
            });

            const result = processApproval();

            if (!result.success) {
                await interaction.reply({ content: result.msg, ephemeral: true });
                return;
            }

            // Check if approver was a named voucher
            const wasNamedVoucher = currentTicket.named_voucher_1 === approver.id ||
                                    currentTicket.named_voucher_2 === approver.id;
            const approvalType = wasNamedVoucher ? 'Named voucher' : 'Brother (48hr fallback)';

            if (result.status === '1/2') {
                await interaction.reply({
                    content: `✅ First approval recorded! (${approvalType})\nTicket: ${ticketId}\nOne more approval needed.`,
                    ephemeral: false
                });
            } else if (result.status === 'VERIFIED') {
                const guild = interaction.guild;
                const member = await guild?.members.fetch(result.userId!);
                const brotherRole = guild?.roles.cache.find(r => r.name === '🦁 ΓΠ Brother');

                if (member && brotherRole) {
                    await member.roles.add(brotherRole);
                    await interaction.reply({
                        content: `✅✅ Verification Complete! (${approvalType})\n\n**${member.user.username}** is now a verified Brother and has been granted the Brother role.`,
                        ephemeral: false
                    });
                } else {
                    await interaction.reply({
                        content: `✅ Verified in database, but failed to assign Discord Role. Check logs.`,
                        ephemeral: true
                    });
                    logger.error('[Access] Role assignment failed. Member or Role not found.');
                }
            }
        }
    } catch (error) {
        logger.error('[Access] Button error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
}

export async function handleAccessModal(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    try {
        if (interaction.customId === 'verify_brother_modal') {
            const realName = interaction.fields.getTextInputValue('real_name');
            const chapter = interaction.fields.getTextInputValue('chapter_init');
            const voucher = interaction.fields.getTextInputValue('voucher_name');
            const zip = interaction.fields.getTextInputValue('zip_code');
            const industry = interaction.fields.getTextInputValue('industry');

            const userId = interaction.user.id;
            const ticketId = `ticket_${userId}_${Date.now()}`;

            // Parse full name into first/last (temporary until Phase 2b multi-step flow)
            const { firstName, lastName } = parseFullName(realName);

            userRepository.upsert({
                discord_id: userId,
                first_name: firstName,
                last_name: lastName,
                zip_code: zip,
                industry: industry
            });

            // Legacy ticket creation - no named vouchers (any brother can approve)
            // This will be replaced in Phase 2b with proper voucher selection
            ticketRepository.create(ticketId, userId, '', '');

            const adminChannelId = config.VERIFICATION_CHANNEL_ID; 
            
            await interaction.reply({ content: `Application Submitted! Ticket ID: ${ticketId}. Please wait for 2 brothers to verify you.`, ephemeral: true });
            
            if (interaction.guild && adminChannelId) {
                const channel = interaction.guild.channels.cache.get(adminChannelId) as TextChannel;
                if (channel) {
                    const embed = new EmbedBuilder()
                        .setTitle('New Verification Request')
                        .setColor('#B41528')
                        .addFields(
                            { name: 'User', value: `<@${userId}>` },
                            { name: 'Name', value: realName },
                            { name: 'Chapter', value: chapter },
                            { name: 'Voucher', value: voucher }
                        );
                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(new ButtonBuilder().setCustomId(`approve_ticket_${ticketId}`).setLabel('Approve').setStyle(ButtonStyle.Success));
                    await channel.send({ embeds: [embed], components: [row] });
                } else {
                    logger.error(`[Access] Could not find Verification Channel: ${adminChannelId}`);
                }
            }
        }
    } catch (error) {
        logger.error('[Access] Modal error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
}

/**
 * Handle new multi-step verification modals (Phase 2b)
 */
export async function handleVerificationModals(interaction: ModalSubmitInteraction) {
    try {
        const customId = interaction.customId;

        // Modal 1: Identity info (first name, last name, don name, year/semester, job title)
        if (customId.startsWith('verify_modal_1_')) {
            await handleModal1(interaction);
        }
        // Modal 2: Contact info (phone, zip/city, vouchers)
        else if (customId.startsWith('verify_modal_2_')) {
            await handleModal2(interaction);
        }
    } catch (error) {
        logger.error('[Access] Verification modal error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'An error occurred while processing your verification. Please try again.',
                ephemeral: true
            });
        }
    }
}

/**
 * Handle Modal 1: Identity info
 */
async function handleModal1(interaction: ModalSubmitInteraction) {
    const customId = interaction.customId;
    const encodedData = customId.replace('verify_modal_1_', '');

    // Decode chapter and industry from customId
    let chapter: string;
    let industry: string;
    try {
        const decoded = JSON.parse(Buffer.from(encodedData, 'base64').toString());
        chapter = decoded.chapter;
        industry = decoded.industry;
    } catch (e) {
        await interaction.reply({
            content: 'Invalid verification data. Please start over with `/verify-start`.',
            ephemeral: true
        });
        return;
    }

    // Get form values
    const firstName = interaction.fields.getTextInputValue('first_name');
    const lastName = interaction.fields.getTextInputValue('last_name');
    const donName = interaction.fields.getTextInputValue('don_name') || '';
    const yearSemesterInput = interaction.fields.getTextInputValue('year_semester');
    const jobTitle = interaction.fields.getTextInputValue('job_title');

    // Validate
    const errors: string[] = [];

    if (!validateName(firstName, true)) {
        errors.push('First name is required (letters only, max 50 characters)');
    }
    if (!validateName(lastName, true)) {
        errors.push('Last name is required (letters only, max 50 characters)');
    }
    if (donName && !validateName(donName, false)) {
        errors.push('Don name must be letters only, max 50 characters');
    }

    const yearSemester = validateYearSemester(yearSemesterInput);
    if (!yearSemester) {
        errors.push('Year & Semester must be format "YYYY Spring" or "YYYY Fall" (e.g., 2015 Spring)');
    }

    if (!jobTitle || jobTitle.trim().length < 2) {
        errors.push('Job title must be at least 2 characters');
    }

    if (errors.length > 0) {
        await interaction.reply({
            content: `**Validation Errors:**\n${errors.map(e => `• ${e}`).join('\n')}\n\nPlease try again with \`/verify-start\`.`,
            ephemeral: true
        });
        return;
    }

    // Store in pending verifications
    const userId = interaction.user.id;
    pendingVerifications.set(userId, {
        chapter,
        industry,
        firstName: normalizeName(firstName),
        lastName: normalizeName(lastName),
        donName: donName ? normalizeName(donName) : '',
        yearSemester: yearSemester!,
        jobTitle: jobTitle.trim(),
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minute expiry
    });

    // Reply with button to continue to step 2 (can't chain modals directly)
    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`verify_continue_${userId}`)
                .setLabel('Continue to Step 2')
                .setStyle(ButtonStyle.Primary)
        );

    await interaction.reply({
        content: `**Step 1 Complete!**\n\nName: ${normalizeName(firstName)} ${normalizeName(lastName)}${donName ? ` (Don ${normalizeName(donName)})` : ''}\nChapter: ${formatChapterName(chapter)}\nInitiation: ${yearSemester!.year} ${yearSemester!.semester}\n\nClick the button below to continue to Step 2.`,
        components: [row],
        ephemeral: true
    });
}

/**
 * Handle Modal 2: Contact info and vouchers
 */
async function handleModal2(interaction: ModalSubmitInteraction) {
    const customId = interaction.customId;
    const pendingUserId = customId.replace('verify_modal_2_', '');
    const userId = interaction.user.id;

    // Verify this is the same user
    if (pendingUserId !== userId) {
        await interaction.reply({
            content: 'Verification session mismatch. Please start over with `/verify-start`.',
            ephemeral: true
        });
        return;
    }

    // Get pending data
    const pendingData = pendingVerifications.get(userId);
    if (!pendingData) {
        await interaction.reply({
            content: 'Your verification session has expired. Please start over with `/verify-start`.',
            ephemeral: true
        });
        return;
    }

    // Get form values
    const voucher1Name = interaction.fields.getTextInputValue('voucher_1');
    const voucher2Name = interaction.fields.getTextInputValue('voucher_2');
    const phone = interaction.fields.getTextInputValue('phone');
    const zipCity = interaction.fields.getTextInputValue('zip_city');

    // Validate
    const errors: string[] = [];

    if (!validatePhoneNumber(phone)) {
        errors.push('Phone number must have at least 10 digits');
    }

    const zipCityResult = validateZipOrCity(zipCity);
    if (!zipCityResult.value) {
        errors.push('Zip code or city is required');
    }

    // Search for vouchers
    const voucher1Results = userRepository.searchBrothersByName(voucher1Name, 5);
    const voucher2Results = userRepository.searchBrothersByName(voucher2Name, 5);

    let voucher1Id: string | null = null;
    let voucher2Id: string | null = null;

    if (voucher1Results.length === 0) {
        errors.push(`Could not find a brother matching "${voucher1Name}". Check spelling or use their full name.`);
    } else if (voucher1Results.length === 1) {
        voucher1Id = voucher1Results[0].discord_id;
    } else {
        // Multiple matches - use best match
        voucher1Id = voucher1Results[0].discord_id;
    }

    if (voucher2Results.length === 0) {
        errors.push(`Could not find a brother matching "${voucher2Name}". Check spelling or use their full name.`);
    } else if (voucher2Results.length === 1) {
        voucher2Id = voucher2Results[0].discord_id;
    } else {
        // Multiple matches - use best match
        voucher2Id = voucher2Results[0].discord_id;
    }

    // Check vouchers are different
    if (voucher1Id && voucher2Id && voucher1Id === voucher2Id) {
        errors.push('You must select two different brothers as vouchers.');
    }

    // Check applicant is not vouching for themselves
    if (voucher1Id === userId || voucher2Id === userId) {
        errors.push('You cannot vouch for yourself.');
    }

    if (errors.length > 0) {
        await interaction.reply({
            content: `**Validation Errors:**\n${errors.map(e => `• ${e}`).join('\n')}\n\nPlease try again with \`/verify-start\`.`,
            ephemeral: true
        });
        pendingVerifications.delete(userId);
        return;
    }

    // Create user record
    const chapter = getChapterByValue(pendingData.chapter);
    userRepository.upsert({
        discord_id: userId,
        first_name: pendingData.firstName,
        last_name: pendingData.lastName,
        don_name: pendingData.donName || undefined,
        chapter: pendingData.chapter,
        initiation_year: pendingData.yearSemester.year,
        initiation_semester: pendingData.yearSemester.semester,
        industry: pendingData.industry,
        job_title: pendingData.jobTitle,
        phone_number: normalizePhoneNumber(phone),
        zip_code: zipCityResult.type === 'zip' ? zipCityResult.value : undefined,
        city: zipCityResult.type === 'city' ? zipCityResult.value : undefined,
        country: 'United States' // Default, can be updated later
    });

    // Create verification ticket
    const ticketId = `ticket_${userId}_${Date.now()}`;
    ticketRepository.create(ticketId, userId, voucher1Id!, voucher2Id!);

    // Clean up pending data
    pendingVerifications.delete(userId);

    // Get voucher display names
    const voucher1 = userRepository.getBrotherForVoucher(voucher1Id!);
    const voucher2 = userRepository.getBrotherForVoucher(voucher2Id!);

    // Reply to user
    await interaction.reply({
        content: `**Application Submitted!**\n\nTicket ID: \`${ticketId}\`\n\nYour vouchers:\n• ${voucher1?.display_name || voucher1Name}\n• ${voucher2?.display_name || voucher2Name}\n\nThey will be notified to approve your verification. After 48 hours, any brother can approve.`,
        ephemeral: true
    });

    // Post to verification channel
    const adminChannelId = config.VERIFICATION_CHANNEL_ID;
    if (interaction.guild && adminChannelId) {
        const channel = interaction.guild.channels.cache.get(adminChannelId) as TextChannel;
        if (channel) {
            const displayName = pendingData.donName
                ? `Don ${pendingData.donName} (${pendingData.firstName} ${pendingData.lastName})`
                : `${pendingData.firstName} ${pendingData.lastName}`;

            const embed = new EmbedBuilder()
                .setTitle('New Verification Request')
                .setColor('#B41528')
                .addFields(
                    { name: 'User', value: `<@${userId}>`, inline: true },
                    { name: 'Name', value: displayName, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: 'Chapter', value: chapter?.label || formatChapterName(pendingData.chapter), inline: true },
                    { name: 'Initiated', value: `${pendingData.yearSemester.year} ${pendingData.yearSemester.semester}`, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: 'Industry', value: pendingData.industry, inline: true },
                    { name: 'Job Title', value: pendingData.jobTitle, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: 'Location', value: zipCityResult.type === 'zip' ? zipCityResult.value : zipCityResult.value, inline: true },
                    { name: 'Phone', value: normalizePhoneNumber(phone), inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: 'Named Vouchers', value: `<@${voucher1Id}> and <@${voucher2Id}>` }
                )
                .setFooter({ text: `Ticket: ${ticketId} • Named vouchers get first priority for 48hrs` })
                .setTimestamp();

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`approve_ticket_${ticketId}`)
                        .setLabel('Approve')
                        .setStyle(ButtonStyle.Success)
                );

            await channel.send({ embeds: [embed], components: [row] });

            // DM vouchers
            try {
                const voucher1Member = await interaction.guild.members.fetch(voucher1Id!);
                await voucher1Member.send({
                    content: `**Verification Request**\n\n<@${userId}> (${displayName}) has listed you as a voucher for their Gamma Pi verification.\n\nChapter: ${chapter?.label || formatChapterName(pendingData.chapter)} (${pendingData.yearSemester.year} ${pendingData.yearSemester.semester})\n\nIf you know this brother, please approve their request in <#${adminChannelId}>.`
                });
            } catch (e) {
                logger.warn(`[Access] Could not DM voucher 1 (${voucher1Id}): ${e}`);
            }

            try {
                const voucher2Member = await interaction.guild.members.fetch(voucher2Id!);
                await voucher2Member.send({
                    content: `**Verification Request**\n\n<@${userId}> (${displayName}) has listed you as a voucher for their Gamma Pi verification.\n\nChapter: ${chapter?.label || formatChapterName(pendingData.chapter)} (${pendingData.yearSemester.year} ${pendingData.yearSemester.semester})\n\nIf you know this brother, please approve their request in <#${adminChannelId}>.`
                });
            } catch (e) {
                logger.warn(`[Access] Could not DM voucher 2 (${voucher2Id}): ${e}`);
            }
        } else {
            logger.error(`[Access] Could not find Verification Channel: ${adminChannelId}`);
        }
    }
}
