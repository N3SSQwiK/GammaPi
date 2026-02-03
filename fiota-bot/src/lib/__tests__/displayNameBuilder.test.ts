/**
 * Unit tests for displayNameBuilder.ts
 *
 * Tests display name formatting utilities:
 * - getDisplayName (full, short, select formats)
 * - getSelectMenuLabel
 * - getSelectMenuDescription
 * - formatChapterName
 * - formatUserForEmbed
 */

import {
    getDisplayName,
    getSelectMenuLabel,
    getSelectMenuDescription,
    formatChapterName,
    formatUserForEmbed,
} from '../displayNameBuilder';
import { UserRow } from '../repositories/userRepository';

// ============================================================================
// Test Fixtures
// ============================================================================

function createMockUser(overrides: Partial<UserRow> = {}): UserRow {
    return {
        discord_id: '123456789',
        first_name: 'John',
        last_name: 'Smith',
        don_name: null,
        real_name: 'John Smith',
        status: 'BROTHER',
        rules_agreed_at: '2024-01-01T00:00:00Z',
        chapter: 'gamma-pi',
        initiation_year: 2015,
        initiation_semester: 'Spring',
        phone_number: '5551234567',
        zip_code: '10001',
        city: 'New York',
        state_province: 'NY',
        country: 'United States',
        location_meta: null,
        industry: 'Technology / Software Engineering',
        job_title: 'Software Engineer',
        linked_in_id: null,
        is_mentor: 0,
        ...overrides,
    };
}

// ============================================================================
// getDisplayName
// ============================================================================

describe('getDisplayName', () => {
    describe('full format', () => {
        it('should return "Don {name} ({real_name})" when don_name exists', () => {
            const user = createMockUser({ don_name: 'Phoenix' });
            expect(getDisplayName(user, 'full')).toBe('Don Phoenix (John Smith)');
        });

        it('should return "{first_name} {last_name}" when no don_name', () => {
            const user = createMockUser({ don_name: null });
            expect(getDisplayName(user, 'full')).toBe('John Smith');
        });

        it('should return "Don {name}" if don_name exists but no real_name', () => {
            const user = createMockUser({
                don_name: 'Phoenix',
                first_name: null,
                last_name: null,
                real_name: null,
            });
            expect(getDisplayName(user, 'full')).toBe('Don Phoenix');
        });

        it('should return "Unknown Brother" when no names at all', () => {
            const user = createMockUser({
                don_name: null,
                first_name: null,
                last_name: null,
                real_name: null,
            });
            expect(getDisplayName(user, 'full')).toBe('Unknown Brother');
        });

        it('should default to full format', () => {
            const user = createMockUser({ don_name: 'Phoenix' });
            expect(getDisplayName(user)).toBe('Don Phoenix (John Smith)');
        });
    });

    describe('short format', () => {
        it('should return "Don {name}" when don_name exists', () => {
            const user = createMockUser({ don_name: 'Phoenix' });
            expect(getDisplayName(user, 'short')).toBe('Don Phoenix');
        });

        it('should return first_name when no don_name', () => {
            const user = createMockUser({ don_name: null });
            expect(getDisplayName(user, 'short')).toBe('John');
        });

        it('should return "Unknown" when no names', () => {
            const user = createMockUser({
                don_name: null,
                first_name: null,
                last_name: null,
                real_name: null,
            });
            expect(getDisplayName(user, 'short')).toBe('Unknown');
        });
    });

    describe('select format', () => {
        it('should return "Don {name} - {industry}" when don_name exists', () => {
            const user = createMockUser({
                don_name: 'Phoenix',
                industry: 'Technology / Software Engineering',
            });
            const result = getDisplayName(user, 'select');
            expect(result).toContain('Don Phoenix');
            expect(result).toContain('Tech/SWE');
        });

        it('should return "{full_name} - {industry}" when no don_name', () => {
            const user = createMockUser({
                don_name: null,
                industry: 'Banking / Financial Services',
            });
            const result = getDisplayName(user, 'select');
            expect(result).toContain('John Smith');
            expect(result).toContain('Finance');
        });

        it('should omit industry if not set', () => {
            const user = createMockUser({
                don_name: 'Phoenix',
                industry: null,
            });
            expect(getDisplayName(user, 'select')).toBe('Don Phoenix');
        });
    });

    describe('edge cases', () => {
        it('should trim whitespace from names', () => {
            const user = createMockUser({
                first_name: '  John  ',
                last_name: '  Smith  ',
                real_name: '  John Smith  ',
                don_name: '  Phoenix  ',
            });
            expect(getDisplayName(user, 'full')).toBe('Don Phoenix (John Smith)');
        });

        it('should treat empty strings as no value', () => {
            const user = createMockUser({
                don_name: '',
                first_name: '',
                last_name: '',
                real_name: '',
            });
            expect(getDisplayName(user, 'full')).toBe('Unknown Brother');
        });
    });
});

// ============================================================================
// getSelectMenuLabel
// ============================================================================

describe('getSelectMenuLabel', () => {
    it('should format as "Name - Industry - City"', () => {
        const user = createMockUser({
            don_name: 'Phoenix',
            industry: 'Technology / Software Engineering',
            city: 'NYC',
        });
        const result = getSelectMenuLabel(user);
        expect(result).toContain('Don Phoenix');
        expect(result).toContain('Tech/SWE');
        expect(result).toContain('NYC');
    });

    it('should use state if no city', () => {
        const user = createMockUser({
            don_name: 'Phoenix',
            industry: 'Technology / Software Engineering',
            city: null,
            state_province: 'California',
        });
        const result = getSelectMenuLabel(user);
        expect(result).toContain('California');
    });

    it('should truncate to 100 characters max', () => {
        const user = createMockUser({
            first_name: 'A'.repeat(50),
            last_name: 'B'.repeat(50),
            real_name: 'A'.repeat(50) + ' ' + 'B'.repeat(50),
            industry: 'C'.repeat(50),
            city: 'D'.repeat(50),
        });
        const result = getSelectMenuLabel(user);
        expect(result.length).toBeLessThanOrEqual(100);
    });
});

// ============================================================================
// getSelectMenuDescription
// ============================================================================

describe('getSelectMenuDescription', () => {
    it('should format as "Chapter Year - Job Title"', () => {
        const user = createMockUser({
            chapter: 'gamma-pi',
            initiation_year: 2015,
            job_title: 'Software Engineer',
        });
        const result = getSelectMenuDescription(user);
        expect(result).toContain('Gamma Pi');
        expect(result).toContain('2015');
        expect(result).toContain('Software Engineer');
    });

    it('should handle missing initiation year', () => {
        const user = createMockUser({
            chapter: 'alpha-alpha',
            initiation_year: null,
            job_title: 'Manager',
        });
        const result = getSelectMenuDescription(user);
        expect(result).toContain('Alpha Alpha');
        expect(result).not.toContain('null');
    });

    it('should truncate to 100 characters', () => {
        const user = createMockUser({
            chapter: 'gamma-pi',
            initiation_year: 2015,
            job_title: 'A'.repeat(100),
        });
        const result = getSelectMenuDescription(user);
        expect(result.length).toBeLessThanOrEqual(100);
    });
});

// ============================================================================
// formatChapterName
// ============================================================================

describe('formatChapterName', () => {
    it('should convert kebab-case to Title Case', () => {
        expect(formatChapterName('gamma-pi')).toBe('Gamma Pi');
    });

    it('should handle single word', () => {
        expect(formatChapterName('omega')).toBe('Omega');
    });

    it('should handle multiple words', () => {
        expect(formatChapterName('alpha-alpha-alpha')).toBe('Alpha Alpha Alpha');
    });
});

// ============================================================================
// formatUserForEmbed
// ============================================================================

describe('formatUserForEmbed', () => {
    it('should return all formatted fields', () => {
        const user = createMockUser({
            don_name: 'Phoenix',
            chapter: 'gamma-pi',
            initiation_year: 2015,
            initiation_semester: 'Spring',
            city: 'New York',
            state_province: 'NY',
            industry: 'Technology / Software Engineering',
            job_title: 'Software Engineer',
            phone_number: '5551234567',
        });

        const result = formatUserForEmbed(user);

        expect(result.name).toBe('Don Phoenix (John Smith)');
        expect(result.chapter).toBe('Gamma Pi');
        expect(result.initiation).toBe('2015 Spring');
        expect(result.location).toContain('New York');
        expect(result.industry).toBe('Technology / Software Engineering');
        expect(result.jobTitle).toBe('Software Engineer');
        expect(result.phone).toBe('5551234567');
    });

    it('should return "Not specified" for missing fields (edge case: no location data)', () => {
        const user = createMockUser({
            chapter: null,
            initiation_year: null,
            initiation_semester: null,
            city: null,
            state_province: null,
            zip_code: null, // Also clear zip_code to test true "no location" scenario
            industry: null,
            job_title: null,
            phone_number: null,
        });

        const result = formatUserForEmbed(user);

        expect(result.chapter).toBe('Not specified');
        expect(result.initiation).toBe('Not specified');
        expect(result.location).toBe('Not specified'); // Shows "Not specified" when ALL location fields are empty
        expect(result.industry).toBe('Not specified');
        expect(result.jobTitle).toBe('Not specified');
        expect(result.phone).toBe('Not provided');
    });

    it('should show zip_code if no city/state', () => {
        const user = createMockUser({
            city: null,
            state_province: null,
            zip_code: '10001',
        });

        const result = formatUserForEmbed(user);
        expect(result.location).toBe('10001');
    });

    it('should exclude "United States" from location', () => {
        const user = createMockUser({
            city: 'New York',
            state_province: 'NY',
            country: 'United States',
        });

        const result = formatUserForEmbed(user);
        expect(result.location).not.toContain('United States');
    });

    it('should include non-US countries', () => {
        const user = createMockUser({
            city: 'Toronto',
            state_province: 'ON',
            country: 'Canada',
        });

        const result = formatUserForEmbed(user);
        expect(result.location).toContain('Canada');
    });
});
