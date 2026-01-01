import { Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, TextChannel, ModalSubmitInteraction } from 'discord.js';
import db from '../../lib/db';
import { config } from '../../config';
import { userRepository } from '../../lib/repositories/userRepository';
import { ticketRepository } from '../../lib/repositories/ticketRepository';
import logger from '../../lib/logger';
import { validateYearSemester, validatePhoneNumber, validateZipOrCity, validateName, normalizeName, normalizePhoneNumber } from '../../lib/validation';
import { getChapterByValue } from '../../lib/constants';
import { getDisplayName, formatChapterName } from '../../lib/displayNameBuilder';
import { pendingVerifyStarts, pendingVerifications } from '../../lib/verificationState';

export async function handleAccessButton(interaction: Interaction) {
    if (!interaction.isButton()) return;

    try {
        // Main verification gate button - shows choice screen
        if (interaction.customId === 'verify_gate_start') {
            const embed = new EmbedBuilder()
                .setColor('#B41528')
                .setTitle('Choose Your Verification Path')
                .setDescription('Please select the option that applies to you:')
                .addFields(
                    {
                        name: '🦁 I\'m a Brother',
                        value: 'I was initiated into a chapter of Phi Iota Alpha Fraternity.'
                    },
                    {
                        name: '🌍 I\'m a Guest',
                        value: 'I\'m a prospective member, family, friend, or professional contact.'
                    }
                );

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_choice_brother')
                        .setLabel('🦁 I\'m a Brother')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('verify_choice_guest')
                        .setLabel('🌍 I\'m a Guest')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('verify_choice_cancel')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.reply({
                embeds: [embed],
                components: [row],
                ephemeral: true
            });
            return;
        }

        // Brother choice - show instructions for /verify-start
        if (interaction.customId === 'verify_choice_brother') {
            const embed = new EmbedBuilder()
                .setColor('#B41528')
                .setTitle('🦁 Brother Verification')
                .setDescription(
                    'Welcome, Hermano! To verify as a brother, you\'ll need to:\n\n' +
                    '**Step 1:** Run the `/verify-start` command\n' +
                    '**Step 2:** Select your chapter and industry from the searchable list\n' +
                    '**Step 3:** Fill out your identity information\n' +
                    '**Step 4:** Name two ΓΠ brothers who can vouch for you\n\n' +
                    'Once submitted, any ΓΠ brother can approve your request.\n\n' +
                    '**Type `/verify-start` in any channel to begin.**'
                )
                .setFooter({ text: 'Phi Iota Alpha Fraternity • La Unión Hace La Fuerza' });

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_gate_back')
                        .setLabel('← Back')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.update({
                embeds: [embed],
                components: [row]
            });
            return;
        }

        // Guest choice - show guest flow
        if (interaction.customId === 'verify_choice_guest') {
            const embed = new EmbedBuilder()
                .setColor('#B41528')
                .setTitle('🌍 Guest Access')
                .setDescription(
                    'Welcome to Gamma Pi!\n\n' +
                    'As a guest, you\'ll have access to:\n' +
                    '• Public channels and announcements\n' +
                    '• Event invitations\n' +
                    '• Networking opportunities\n\n' +
                    '**Guest verification is coming soon.**\n' +
                    'For now, please introduce yourself in the public channels and a brother will assist you.'
                )
                .setFooter({ text: 'Phi Iota Alpha Fraternity • La Unión Hace La Fuerza' });

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_gate_back')
                        .setLabel('← Back')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.update({
                embeds: [embed],
                components: [row]
            });
            return;
        }

        // Back button - return to choice screen (updates existing message)
        if (interaction.customId === 'verify_gate_back') {
            const embed = new EmbedBuilder()
                .setColor('#B41528')
                .setTitle('Choose Your Verification Path')
                .setDescription('Please select the option that applies to you:')
                .addFields(
                    {
                        name: '🦁 I\'m a Brother',
                        value: 'I was initiated into a chapter of Phi Iota Alpha Fraternity.'
                    },
                    {
                        name: '🌍 I\'m a Guest',
                        value: 'I\'m a prospective member, family, friend, or professional contact.'
                    }
                );

            const row = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('verify_choice_brother')
                        .setLabel('🦁 I\'m a Brother')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('verify_choice_guest')
                        .setLabel('🌍 I\'m a Guest')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId('verify_choice_cancel')
                        .setLabel('❌ Cancel')
                        .setStyle(ButtonStyle.Secondary)
                );

            await interaction.update({
                embeds: [embed],
                components: [row]
            });
            return;
        }

        // Cancel - dismiss the message
        if (interaction.customId === 'verify_choice_cancel') {
            await interaction.update({
                content: 'Verification cancelled. Click the button in the welcome message to start again.',
                embeds: [],
                components: []
            });
            return;
        }

        // Legacy button - redirect to /verify-start
        if (interaction.customId === 'verify_brother_start') {
            await interaction.reply({
                content: 'Please use the `/verify-start` command to begin verification.',
                ephemeral: true
            });
            return;
        }

        // Legacy guest button
        if (interaction.customId === 'verify_guest_start') {
            await interaction.reply({ content: 'LinkedIn Verification Link: [Click Here](https://linkedin.com) (Stub)', ephemeral: true });
            return;
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
            // Extract full ticket ID (format: approve_ticket_ticket_<userId>_<timestamp>)
            const ticketId = interaction.customId.replace('approve_ticket_', '');
            const approver = interaction.user;

            // Check if approver has the ΓΠ Brother role (Discord role is source of truth)
            const guild = interaction.guild;
            if (!guild) {
                await interaction.reply({ content: 'This command must be used in a server.', ephemeral: true });
                return;
            }

            const member = await guild.members.fetch(approver.id);
            const hasBrotherRole = member.roles.cache.some(r => r.name === '🦁 ΓΠ Brother');
            if (!hasBrotherRole) {
                await interaction.reply({
                    content: 'Only verified ΓΠ brothers can approve verification requests.',
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
            const approvalType = wasNamedVoucher ? 'Named voucher' : 'Brother';

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

    // Legacy modal handler removed - all verification now uses /verify-start flow
    // This function is kept for backward compatibility in case old embeds still exist
    if (interaction.customId === 'verify_brother_modal') {
        await interaction.reply({
            content: 'This verification method has been replaced. Please use the `/verify-start` command instead.',
            ephemeral: true
        });
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
    const stateUserId = customId.replace('verify_modal_1_', '');
    const userId = interaction.user.id;

    // Verify the user matches the state
    if (stateUserId !== userId) {
        await interaction.reply({
            content: 'Verification session mismatch. Please start over with `/verify-start`.',
            ephemeral: true
        });
        return;
    }

    // Get chapter and industry from server-side state (stored by /verify-start)
    const startData = pendingVerifyStarts.get(userId);
    if (!startData) {
        await interaction.reply({
            content: 'Your verification session has expired. Please start over with `/verify-start`.',
            ephemeral: true
        });
        return;
    }

    const { chapter, industry } = startData;

    // Clean up the start data (we'll store combined data after validation)
    pendingVerifyStarts.delete(userId);

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

    // Store in pending verifications (userId already defined above)
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
        content: `**Application Submitted!**\n\nTicket ID: \`${ticketId}\`\n\nYour vouchers:\n• ${voucher1?.display_name || voucher1Name}\n• ${voucher2?.display_name || voucher2Name}\n\nThey will be notified to approve your verification. Any ΓΠ brother can approve your request.`,
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
                .setFooter({ text: `Ticket: ${ticketId} • Any ΓΠ brother can approve` })
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

/**
 * Handle profile update modal submission
 */
export async function handleProfileUpdateModal(interaction: ModalSubmitInteraction) {
    try {
        const userId = interaction.user.id;

        // Get current user
        const user = userRepository.getByDiscordId(userId);
        if (!user) {
            await interaction.reply({
                content: 'You are not in the database.',
                ephemeral: true
            });
            return;
        }

        // Get form values
        const donName = interaction.fields.getTextInputValue('don_name').trim();
        const phone = interaction.fields.getTextInputValue('phone').trim();
        const jobTitle = interaction.fields.getTextInputValue('job_title').trim();
        const city = interaction.fields.getTextInputValue('city').trim();

        // Validate and prepare updates
        const updates: Partial<{
            discord_id: string;
            don_name: string | undefined;
            phone_number: string | undefined;
            job_title: string | undefined;
            city: string | undefined;
        }> = { discord_id: userId };
        const changes: string[] = [];

        // Don name
        if (donName && donName !== user.don_name) {
            if (!validateName(donName, false)) {
                await interaction.reply({
                    content: 'Invalid don name. Use letters only, max 50 characters.',
                    ephemeral: true
                });
                return;
            }
            updates.don_name = normalizeName(donName);
            changes.push(`Don Name: ${updates.don_name}`);
        } else if (!donName && user.don_name) {
            // Clearing don name not allowed for now
        }

        // Phone
        if (phone && phone !== user.phone_number) {
            if (!validatePhoneNumber(phone)) {
                await interaction.reply({
                    content: 'Invalid phone number. Must have at least 10 digits.',
                    ephemeral: true
                });
                return;
            }
            updates.phone_number = normalizePhoneNumber(phone);
            changes.push(`Phone: ${updates.phone_number}`);
        }

        // Job title
        if (jobTitle && jobTitle !== user.job_title) {
            updates.job_title = jobTitle;
            changes.push(`Job Title: ${jobTitle}`);
        }

        // City
        if (city && city !== user.city) {
            updates.city = city;
            changes.push(`City: ${city}`);
        }

        if (changes.length === 0) {
            await interaction.reply({
                content: 'No changes detected.',
                ephemeral: true
            });
            return;
        }

        // Apply updates
        userRepository.upsert(updates);

        const newDisplayName = getDisplayName({ ...user, ...updates } as any, 'full');

        await interaction.reply({
            content: `**Profile Updated!**\n\nDisplay Name: ${newDisplayName}\n\n**Changes:**\n${changes.map(c => `• ${c}`).join('\n')}`,
            ephemeral: true
        });

        logger.info(`[Access] Profile update: ${interaction.user.tag} (${userId}) updated: ${changes.join(', ')}`);
    } catch (error) {
        logger.error('[Access] Profile update modal error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'An error occurred while updating your profile.',
                ephemeral: true
            });
        }
    }
}

/**
 * Handle bootstrap modal submission (founding brother registration)
 * This is used when the server owner needs to seed the first brothers
 * CustomId format: bootstrap_modal_{invokerId}_{targetId}
 */
export async function handleBootstrapModal(interaction: ModalSubmitInteraction) {
    try {
        const customId = interaction.customId;
        const invokerId = interaction.user.id;

        // Parse customId: bootstrap_modal_{invokerId}_{targetId}
        const parts = customId.replace('bootstrap_modal_', '').split('_');
        const expectedInvokerId = parts[0];
        const targetId = parts[1] || parts[0]; // Fallback for old format

        // Verify invoker matches (security check)
        if (expectedInvokerId !== invokerId) {
            await interaction.reply({
                content: 'Session mismatch. Please try again.',
                ephemeral: true
            });
            return;
        }

        // Double-check guild and owner status (in case of race condition)
        const guild = interaction.guild;
        if (!guild || guild.ownerId !== invokerId) {
            await interaction.reply({
                content: 'Only the server owner can complete bootstrap registration.',
                ephemeral: true
            });
            return;
        }

        // Double-check threshold (in case another bootstrap happened during modal)
        const brotherCount = userRepository.countBrothers();
        if (brotherCount >= 2) {
            await interaction.reply({
                content: 'Bootstrap is no longer available. The server already has 2+ brothers.',
                ephemeral: true
            });
            return;
        }

        // Get form values
        const firstName = interaction.fields.getTextInputValue('first_name');
        const lastName = interaction.fields.getTextInputValue('last_name');
        const donName = interaction.fields.getTextInputValue('don_name') || '';
        const yearSemesterInput = interaction.fields.getTextInputValue('year_semester');

        // Validate inputs
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

        if (errors.length > 0) {
            await interaction.reply({
                content: `**Validation Errors:**\n${errors.map(e => `• ${e}`).join('\n')}\n\nPlease try again with \`/bootstrap\`.`,
                ephemeral: true
            });
            return;
        }

        // Create/update user record for TARGET user
        const normalizedFirst = normalizeName(firstName);
        const normalizedLast = normalizeName(lastName);
        const normalizedDon = donName ? normalizeName(donName) : undefined;
        const isSelf = targetId === invokerId;

        userRepository.upsert({
            discord_id: targetId,
            first_name: normalizedFirst,
            last_name: normalizedLast,
            don_name: normalizedDon,
            chapter: 'gamma-pi',
            initiation_year: yearSemester!.year,
            initiation_semester: yearSemester!.semester,
            status: 'BROTHER'
        });

        // Assign brother role to TARGET user
        const targetMember = await guild.members.fetch(targetId);
        const brotherRole = guild.roles.cache.find(r => r.name === '🦁 ΓΠ Brother');

        if (brotherRole) {
            await targetMember.roles.add(brotherRole);
        } else {
            logger.warn('[Bootstrap] Brother role not found. Run /setup to create server structure.');
        }

        // Log the bootstrap event
        const displayName = normalizedDon
            ? `Don ${normalizedDon} (${normalizedFirst} ${normalizedLast})`
            : `${normalizedFirst} ${normalizedLast}`;

        if (isSelf) {
            logger.info(`[Bootstrap] ${interaction.user.tag} (${invokerId}) bootstrapped as founding brother: ${displayName}`);
        } else {
            logger.info(`[Bootstrap] ${interaction.user.tag} (${invokerId}) bootstrapped ${targetMember.user.tag} (${targetId}) as founding brother: ${displayName}`);
        }

        // Reply to user
        const successMessage = isSelf
            ? `**You have been registered as a founding brother.**\n\nName: ${displayName}\nChapter: Gamma Pi\nInitiated: ${yearSemester!.year} ${yearSemester!.semester}\n\nYou can now approve verification requests from other brothers.`
            : `**${targetMember.user.username} has been registered as a founding brother.**\n\nName: ${displayName}\nChapter: Gamma Pi\nInitiated: ${yearSemester!.year} ${yearSemester!.semester}\n\nThey can now approve verification requests from other brothers.`;

        await interaction.reply({
            content: successMessage,
            ephemeral: true
        });

    } catch (error) {
        logger.error('[Bootstrap] Modal error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: 'An error occurred during bootstrap registration. Please try again.',
                ephemeral: true
            });
        }
    }
}
