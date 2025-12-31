/**
 * DISPLAY NAME BUILDER
 *
 * Utility for consistent brother name formatting across the bot.
 * Priority: Don name > Legal name
 *
 * Display formats:
 * - Full: "Don Phoenix (John Smith)" or "John Smith"
 * - Short: "Don Phoenix" or "John"
 * - Select menu: "Don Phoenix - Tech" or "John Smith - Finance"
 */

import { UserRow } from './repositories/userRepository';

export type DisplayFormat = 'full' | 'short' | 'select';

/**
 * Get display name for a user
 *
 * @param user - User row from database
 * @param format - Display format (default: 'full')
 * @returns Formatted display name
 */
export function getDisplayName(user: UserRow, format: DisplayFormat = 'full'): string {
    const firstName = user.first_name?.trim() || '';
    const lastName = user.last_name?.trim() || '';
    const donName = user.don_name?.trim() || '';
    const realName = user.real_name?.trim() || '';  // Legacy fallback

    const hasLegalName = firstName && lastName;
    const hasDonName = donName.length > 0;
    const hasRealName = realName.length > 0;

    switch (format) {
        case 'full':
            if (hasDonName && hasLegalName) {
                return `Don ${donName} (${firstName} ${lastName})`;
            } else if (hasDonName) {
                return `Don ${donName}`;
            } else if (hasLegalName) {
                return `${firstName} ${lastName}`;
            } else if (hasRealName) {
                return realName;  // Legacy fallback
            }
            return 'Unknown Brother';

        case 'short':
            if (hasDonName) {
                return `Don ${donName}`;
            } else if (firstName) {
                return firstName;
            } else if (hasRealName) {
                // Extract first name from legacy real_name
                return realName.split(' ')[0];
            }
            return 'Unknown';

        case 'select':
            // For select menus: "Don Phoenix - Tech" or "John Smith - Finance"
            const name = hasDonName ? `Don ${donName}` : hasLegalName ? `${firstName} ${lastName}` : hasRealName ? realName : 'Unknown';
            const industry = user.industry ? ` - ${truncateIndustry(user.industry)}` : '';
            return `${name}${industry}`;

        default:
            return hasLegalName ? `${firstName} ${lastName}` : hasRealName ? realName : 'Unknown';
    }
}

/**
 * Get a short label for select menu options
 * Format: "Don Phoenix - Tech - NYC" or "John Smith - Finance - LA"
 *
 * @param user - User row from database
 * @returns Short label for select menu (max ~50 chars)
 */
export function getSelectMenuLabel(user: UserRow): string {
    const name = getDisplayName(user, 'short');
    const parts = [name];

    // Add industry abbreviation
    if (user.industry) {
        parts.push(truncateIndustry(user.industry));
    }

    // Add location
    if (user.city) {
        parts.push(user.city);
    } else if (user.state_province) {
        parts.push(user.state_province);
    }

    return parts.join(' - ').substring(0, 100); // Discord limit
}

/**
 * Get description for select menu options
 * Format: "Gamma Pi 2015 - Software Engineer"
 *
 * @param user - User row from database
 * @returns Description string (max 100 chars for Discord)
 */
export function getSelectMenuDescription(user: UserRow): string {
    const parts: string[] = [];

    // Chapter and year
    if (user.chapter) {
        const chapterInfo = user.initiation_year
            ? `${formatChapterName(user.chapter)} ${user.initiation_year}`
            : formatChapterName(user.chapter);
        parts.push(chapterInfo);
    }

    // Job title
    if (user.job_title) {
        parts.push(user.job_title);
    }

    return parts.join(' - ').substring(0, 100);
}

/**
 * Format a chapter value (kebab-case) to display name
 * "gamma-pi" -> "Gamma Pi"
 *
 * @param chapterValue - Chapter value from database
 * @returns Formatted chapter name
 */
export function formatChapterName(chapterValue: string): string {
    return chapterValue
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Truncate industry for display in compact spaces
 * "Technology / Software Engineering" -> "Tech/SWE"
 *
 * @param industry - Full industry string
 * @returns Abbreviated industry (max 15 chars)
 */
function truncateIndustry(industry: string): string {
    // Common abbreviations
    const abbrevMap: Record<string, string> = {
        'Technology / Software Engineering': 'Tech/SWE',
        'Technology / Cybersecurity': 'Tech/Cyber',
        'Technology / Data Science / Analytics': 'Tech/Data',
        'Technology / Hardware / Semiconductors': 'Tech/HW',
        'Banking / Financial Services': 'Finance',
        'Healthcare / Medical (Clinical Practice)': 'Healthcare',
        'Healthcare / Medical (Hospital Administration)': 'Healthcare Admin',
        'Healthcare / Medical (Research)': 'Medical Research',
        'Legal / Law (Corporate)': 'Legal/Corp',
        'Legal / Law (Criminal / Public Interest)': 'Legal/Public',
        'Education / Academia (K-12)': 'Education K-12',
        'Education / Academia (Higher Ed)': 'Higher Ed',
        'Government / Public Administration (Federal)': 'Gov/Federal',
        'Government / Public Administration (State / Local)': 'Gov/State',
        'Consulting (Business / Management)': 'Consulting',
        'Consulting (Technology / IT)': 'IT Consulting',
        'Engineering (Civil)': 'Civil Eng',
        'Engineering (Electrical / Computer)': 'EE/CE',
        'Engineering (Mechanical / Industrial)': 'Mech Eng',
        'Marketing / Advertising / PR': 'Marketing',
        'Non-Profit / Social Services': 'Non-Profit',
        'Real Estate / Property Management': 'Real Estate',
        'Venture Capital / Private Equity': 'VC/PE',
        'Military / Veterans Services': 'Military',
    };

    if (abbrevMap[industry]) {
        return abbrevMap[industry];
    }

    // Generic abbreviation: take first part before " / "
    const firstPart = industry.split(' / ')[0];
    return firstPart.length <= 15 ? firstPart : firstPart.substring(0, 12) + '...';
}

/**
 * Format user info for embed display
 *
 * @param user - User row from database
 * @returns Object with formatted fields for Discord embed
 */
export function formatUserForEmbed(user: UserRow): {
    name: string;
    chapter: string;
    initiation: string;
    location: string;
    industry: string;
    jobTitle: string;
    phone: string;
} {
    return {
        name: getDisplayName(user, 'full'),
        chapter: user.chapter ? formatChapterName(user.chapter) : 'Not specified',
        initiation: user.initiation_year && user.initiation_semester
            ? `${user.initiation_year} ${user.initiation_semester}`
            : user.initiation_year
                ? `${user.initiation_year}`
                : 'Not specified',
        location: formatLocation(user),
        industry: user.industry || 'Not specified',
        jobTitle: user.job_title || 'Not specified',
        phone: user.phone_number || 'Not provided'
    };
}

/**
 * Format location for display
 *
 * @param user - User row from database
 * @returns Formatted location string
 */
function formatLocation(user: UserRow): string {
    const parts: string[] = [];

    if (user.city) {
        parts.push(user.city);
    }

    if (user.state_province) {
        parts.push(user.state_province);
    }

    if (user.country && user.country !== 'United States') {
        parts.push(user.country);
    }

    if (parts.length === 0 && user.zip_code) {
        return user.zip_code;
    }

    return parts.join(', ') || 'Not specified';
}
