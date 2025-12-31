/**
 * VALIDATION UTILITIES
 *
 * Input validation for verification flow and user data
 */

import { isValidChapter, isValidIndustry } from './constants';

// ============================================================================
// TYPES
// ============================================================================

export interface YearSemesterResult {
    year: number;
    semester: 'Spring' | 'Fall';
}

export interface ZipOrCityResult {
    type: 'zip' | 'city';
    value: string;
}

export interface VoucherSearchResult {
    discord_id: string;
    display_name: string;  // "Don Phoenix" or "John Smith"
    first_name: string;
    last_name: string;
    don_name: string | null;
}

// ============================================================================
// CHAPTER VALIDATION
// ============================================================================

/**
 * Validate chapter input against CHAPTERS constant
 * @param input - Chapter value (kebab-case)
 * @returns true if valid chapter exists
 */
export function validateChapter(input: string): boolean {
    return isValidChapter(input);
}

// ============================================================================
// INDUSTRY VALIDATION
// ============================================================================

/**
 * Validate industry input against INDUSTRIES constant
 * @param input - Industry string
 * @returns true if valid industry
 */
export function validateIndustry(input: string): boolean {
    return isValidIndustry(input);
}

// ============================================================================
// YEAR & SEMESTER VALIDATION
// ============================================================================

/**
 * Validate and parse year/semester input
 * Format: "YYYY Spring" or "YYYY Fall"
 * Valid years: 1931-2029 (fraternity founded 1931)
 *
 * @param input - User input string
 * @returns Parsed year/semester or null if invalid
 */
export function validateYearSemester(input: string): YearSemesterResult | null {
    const trimmed = input.trim();

    // Regex: 4-digit year (1931-2029), space(s), Spring or Fall (case-insensitive)
    const regex = /^(19[3-9]\d|20[0-2]\d)\s+(Spring|Fall)$/i;
    const match = trimmed.match(regex);

    if (!match) {
        return null;
    }

    const year = parseInt(match[1], 10);
    const semester = match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase() as 'Spring' | 'Fall';

    // Additional validation: year shouldn't be in the future
    const currentYear = new Date().getFullYear();
    if (year > currentYear) {
        return null;
    }

    return { year, semester };
}

// ============================================================================
// PHONE NUMBER VALIDATION
// ============================================================================

/**
 * Validate phone number format
 * Allows international formats: +1 (555) 123-4567, +52 55 1234 5678, etc.
 * Minimum 10 digits required
 *
 * @param input - User input phone number
 * @returns true if valid phone number format
 */
export function validatePhoneNumber(input: string): boolean {
    const trimmed = input.trim();

    // Allow digits, spaces, parentheses, hyphens, plus signs, dots
    const formatRegex = /^[\d\s\(\)\-\+\.]+$/;
    if (!formatRegex.test(trimmed)) {
        return false;
    }

    // Extract just digits and count them (minimum 10)
    const digitsOnly = trimmed.replace(/\D/g, '');
    return digitsOnly.length >= 10;
}

/**
 * Normalize phone number to a consistent format
 * Strips non-digits except leading +
 *
 * @param input - Raw phone input
 * @returns Normalized phone string
 */
export function normalizePhoneNumber(input: string): string {
    const trimmed = input.trim();
    const hasPlus = trimmed.startsWith('+');
    const digitsOnly = trimmed.replace(/\D/g, '');
    return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

// ============================================================================
// ZIP CODE / CITY VALIDATION
// ============================================================================

/**
 * Determine if input is a US zip code or city name
 * 5-digit numbers are treated as US zip codes
 * Everything else is treated as a city
 *
 * @param input - User input (zip or city)
 * @returns Parsed type and sanitized value
 */
export function validateZipOrCity(input: string): ZipOrCityResult {
    const trimmed = input.trim();

    // Check if exactly 5 digits (US zip code)
    if (/^\d{5}$/.test(trimmed)) {
        return { type: 'zip', value: trimmed };
    }

    // Also accept 5+4 format (12345-6789) as zip
    if (/^\d{5}-\d{4}$/.test(trimmed)) {
        return { type: 'zip', value: trimmed.substring(0, 5) }; // Store just the 5-digit portion
    }

    // Everything else is treated as city
    return { type: 'city', value: trimmed };
}

// ============================================================================
// NAME VALIDATION
// ============================================================================

/**
 * Validate name field (first name, last name, don name)
 * Must be 1-50 characters, letters/spaces/hyphens/apostrophes allowed
 *
 * @param input - Name input
 * @param required - Whether the field is required
 * @returns true if valid
 */
export function validateName(input: string, required = true): boolean {
    const trimmed = input.trim();

    if (!required && trimmed.length === 0) {
        return true;
    }

    if (trimmed.length === 0 || trimmed.length > 50) {
        return false;
    }

    // Allow letters (including accented), spaces, hyphens, apostrophes
    // This regex supports Latin characters with diacritics common in Spanish names
    const nameRegex = /^[\p{L}\s\-']+$/u;
    return nameRegex.test(trimmed);
}

/**
 * Normalize a name (capitalize first letter of each word)
 *
 * @param input - Raw name input
 * @returns Normalized name
 */
export function normalizeName(input: string): string {
    return input
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// ============================================================================
// VOUCHER NAME SEARCH
// ============================================================================

/**
 * Parse voucher input and search for matching brothers
 * Input can be:
 * - "Don Phoenix" (don name)
 * - "John Smith" (first + last name)
 * - "Phoenix" (partial match)
 *
 * This function returns a SQL-safe search pattern.
 * Actual database search is done in userRepository.
 *
 * @param input - Voucher name input from user
 * @returns Cleaned search terms
 */
export function parseVoucherSearch(input: string): { terms: string[]; raw: string } {
    const trimmed = input.trim();

    // Remove "Don " prefix if present (case-insensitive)
    const withoutDon = trimmed.replace(/^don\s+/i, '');

    // Split into individual terms
    const terms = withoutDon.split(/\s+/).filter(t => t.length > 0);

    return { terms, raw: trimmed };
}

/**
 * Calculate a simple match score for fuzzy name matching
 * Higher score = better match
 *
 * @param query - Search query terms
 * @param candidate - Candidate name to match against
 * @returns Match score (0 = no match)
 */
export function calculateNameMatchScore(query: string[], candidate: VoucherSearchResult): number {
    let score = 0;
    const queryLower = query.map(q => q.toLowerCase());

    // Check don_name match (highest priority)
    if (candidate.don_name) {
        const donLower = candidate.don_name.toLowerCase();
        for (const q of queryLower) {
            if (donLower === q) {
                score += 100; // Exact don name match
            } else if (donLower.includes(q)) {
                score += 50; // Partial don name match
            }
        }
    }

    // Check first_name match
    const firstLower = candidate.first_name.toLowerCase();
    for (const q of queryLower) {
        if (firstLower === q) {
            score += 80;
        } else if (firstLower.startsWith(q)) {
            score += 40;
        }
    }

    // Check last_name match
    const lastLower = candidate.last_name.toLowerCase();
    for (const q of queryLower) {
        if (lastLower === q) {
            score += 80;
        } else if (lastLower.startsWith(q)) {
            score += 40;
        }
    }

    return score;
}

// ============================================================================
// JOB TITLE VALIDATION
// ============================================================================

/**
 * Validate job title
 * Must be 2-100 characters
 *
 * @param input - Job title input
 * @returns true if valid
 */
export function validateJobTitle(input: string): boolean {
    const trimmed = input.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
}

// ============================================================================
// COMPOSITE VALIDATION
// ============================================================================

export interface VerificationValidationResult {
    valid: boolean;
    errors: string[];
    parsed: {
        firstName?: string;
        lastName?: string;
        donName?: string;
        yearSemester?: YearSemesterResult;
        phone?: string;
        zipOrCity?: ZipOrCityResult;
        jobTitle?: string;
    };
}

/**
 * Validate all fields from verification modal
 * Returns detailed errors for user feedback
 *
 * @param fields - Object containing all modal field values
 * @returns Validation result with errors and parsed values
 */
export function validateVerificationFields(fields: {
    firstName: string;
    lastName: string;
    donName: string;
    yearSemester: string;
    phone: string;
    zipOrCity: string;
    jobTitle: string;
}): VerificationValidationResult {
    const errors: string[] = [];
    const parsed: VerificationValidationResult['parsed'] = {};

    // First Name
    if (!validateName(fields.firstName, true)) {
        errors.push('First name is required (letters only, max 50 characters)');
    } else {
        parsed.firstName = normalizeName(fields.firstName);
    }

    // Last Name
    if (!validateName(fields.lastName, true)) {
        errors.push('Last name is required (letters only, max 50 characters)');
    } else {
        parsed.lastName = normalizeName(fields.lastName);
    }

    // Don Name (optional)
    if (fields.donName.trim().length > 0) {
        if (!validateName(fields.donName, false)) {
            errors.push('Don name must be letters only, max 50 characters');
        } else {
            parsed.donName = normalizeName(fields.donName);
        }
    }

    // Year & Semester
    const yearSemResult = validateYearSemester(fields.yearSemester);
    if (!yearSemResult) {
        errors.push('Year & Semester must be in format "YYYY Spring" or "YYYY Fall" (e.g., 2015 Spring)');
    } else {
        parsed.yearSemester = yearSemResult;
    }

    // Phone
    if (!validatePhoneNumber(fields.phone)) {
        errors.push('Phone number must have at least 10 digits');
    } else {
        parsed.phone = normalizePhoneNumber(fields.phone);
    }

    // Zip/City
    const zipCityResult = validateZipOrCity(fields.zipOrCity);
    if (!zipCityResult.value) {
        errors.push('Zip code or city is required');
    } else {
        parsed.zipOrCity = zipCityResult;
    }

    // Job Title
    if (!validateJobTitle(fields.jobTitle)) {
        errors.push('Job title must be 2-100 characters');
    } else {
        parsed.jobTitle = fields.jobTitle.trim();
    }

    return {
        valid: errors.length === 0,
        errors,
        parsed
    };
}
