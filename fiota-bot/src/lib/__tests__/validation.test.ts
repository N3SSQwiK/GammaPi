/**
 * Unit tests for validation.ts
 *
 * Tests validation utilities for the verification flow:
 * - validateYearSemester
 * - validatePhoneNumber
 * - validateZipOrCity
 * - validateName
 * - parseVoucherSearch
 * - calculateNameMatchScore
 */

import {
    validateYearSemester,
    validatePhoneNumber,
    normalizePhoneNumber,
    validateZipOrCity,
    validateName,
    normalizeName,
    parseVoucherSearch,
    calculateNameMatchScore,
    validateJobTitle,
    VoucherSearchResult,
} from '../validation';

// ============================================================================
// validateYearSemester
// ============================================================================

describe('validateYearSemester', () => {
    describe('valid inputs', () => {
        it('should parse "2015 Spring" correctly', () => {
            const result = validateYearSemester('2015 Spring');
            expect(result).toEqual({ year: 2015, semester: 'Spring' });
        });

        it('should parse "1931 Fall" (fraternity founding year)', () => {
            const result = validateYearSemester('1931 Fall');
            expect(result).toEqual({ year: 1931, semester: 'Fall' });
        });

        it('should handle lowercase semester', () => {
            const result = validateYearSemester('2010 spring');
            expect(result).toEqual({ year: 2010, semester: 'Spring' });
        });

        it('should handle UPPERCASE semester', () => {
            const result = validateYearSemester('2010 FALL');
            expect(result).toEqual({ year: 2010, semester: 'Fall' });
        });

        it('should handle extra whitespace', () => {
            const result = validateYearSemester('  2015   Spring  ');
            expect(result).toEqual({ year: 2015, semester: 'Spring' });
        });

        it('should handle multiple spaces between year and semester', () => {
            const result = validateYearSemester('2015    Spring');
            expect(result).toEqual({ year: 2015, semester: 'Spring' });
        });
    });

    describe('invalid inputs', () => {
        it('should reject year only', () => {
            expect(validateYearSemester('2015')).toBeNull();
        });

        it('should reject semester only', () => {
            expect(validateYearSemester('Spring')).toBeNull();
        });

        it('should reject invalid semester', () => {
            expect(validateYearSemester('2015 Summer')).toBeNull();
            expect(validateYearSemester('2015 Winter')).toBeNull();
        });

        it('should reject year before 1931', () => {
            expect(validateYearSemester('1930 Spring')).toBeNull();
            expect(validateYearSemester('1900 Fall')).toBeNull();
        });

        it('should reject future years', () => {
            const futureYear = new Date().getFullYear() + 1;
            expect(validateYearSemester(`${futureYear} Spring`)).toBeNull();
        });

        it('should reject year beyond 2029', () => {
            expect(validateYearSemester('2030 Spring')).toBeNull();
        });

        it('should reject empty string', () => {
            expect(validateYearSemester('')).toBeNull();
        });

        it('should reject reversed order', () => {
            expect(validateYearSemester('Spring 2015')).toBeNull();
        });
    });
});

// ============================================================================
// validatePhoneNumber
// ============================================================================

describe('validatePhoneNumber', () => {
    describe('valid inputs', () => {
        it('should accept US format (555) 123-4567', () => {
            expect(validatePhoneNumber('(555) 123-4567')).toBe(true);
        });

        it('should accept US format with country code +1-555-123-4567', () => {
            expect(validatePhoneNumber('+1-555-123-4567')).toBe(true);
        });

        it('should accept plain digits', () => {
            expect(validatePhoneNumber('5551234567')).toBe(true);
        });

        it('should accept international format with dots', () => {
            expect(validatePhoneNumber('+52.55.1234.5678')).toBe(true);
        });

        it('should accept spaces as separators', () => {
            expect(validatePhoneNumber('555 123 4567')).toBe(true);
        });

        it('should accept 11+ digit international numbers', () => {
            expect(validatePhoneNumber('+44 20 7946 0958')).toBe(true);
        });
    });

    describe('invalid inputs', () => {
        it('should reject numbers with letters', () => {
            expect(validatePhoneNumber('555-CALL-NOW')).toBe(false);
        });

        it('should reject too few digits', () => {
            expect(validatePhoneNumber('555-1234')).toBe(false); // Only 7 digits
        });

        it('should reject empty string', () => {
            expect(validatePhoneNumber('')).toBe(false);
        });

        it('should reject special characters', () => {
            expect(validatePhoneNumber('555@123#4567')).toBe(false);
        });
    });
});

describe('normalizePhoneNumber', () => {
    it('should strip formatting and keep digits', () => {
        expect(normalizePhoneNumber('(555) 123-4567')).toBe('5551234567');
    });

    it('should preserve leading + for international', () => {
        expect(normalizePhoneNumber('+1-555-123-4567')).toBe('+15551234567');
    });
});

// ============================================================================
// validateZipOrCity
// ============================================================================

describe('validateZipOrCity', () => {
    describe('zip code detection', () => {
        it('should detect 5-digit US zip code', () => {
            expect(validateZipOrCity('10001')).toEqual({ type: 'zip', value: '10001' });
        });

        it('should detect 5+4 zip and extract 5 digits', () => {
            expect(validateZipOrCity('10001-1234')).toEqual({ type: 'zip', value: '10001' });
        });
    });

    describe('city detection', () => {
        it('should detect city name', () => {
            expect(validateZipOrCity('New York')).toEqual({ type: 'city', value: 'New York' });
        });

        it('should detect international city', () => {
            expect(validateZipOrCity('Toronto, Canada')).toEqual({ type: 'city', value: 'Toronto, Canada' });
        });

        it('should treat Canadian postal code as city (not 5 digits)', () => {
            expect(validateZipOrCity('M5V 3A8')).toEqual({ type: 'city', value: 'M5V 3A8' });
        });

        it('should handle leading/trailing whitespace', () => {
            expect(validateZipOrCity('  Chicago  ')).toEqual({ type: 'city', value: 'Chicago' });
        });
    });
});

// ============================================================================
// validateName
// ============================================================================

describe('validateName', () => {
    describe('valid names', () => {
        it('should accept simple name', () => {
            expect(validateName('John')).toBe(true);
        });

        it('should accept name with space', () => {
            expect(validateName('John Paul')).toBe(true);
        });

        it('should accept hyphenated name', () => {
            expect(validateName('Mary-Jane')).toBe(true);
        });

        it('should accept name with apostrophe', () => {
            expect(validateName("O'Connor")).toBe(true);
        });

        it('should accept Spanish accented characters', () => {
            expect(validateName('José')).toBe(true);
            expect(validateName('García')).toBe(true);
            expect(validateName('Muñoz')).toBe(true);
        });
    });

    describe('invalid names', () => {
        it('should reject empty string when required', () => {
            expect(validateName('', true)).toBe(false);
        });

        it('should accept empty string when not required', () => {
            expect(validateName('', false)).toBe(true);
        });

        it('should reject names with numbers', () => {
            expect(validateName('John123')).toBe(false);
        });

        it('should reject names with special characters', () => {
            expect(validateName('John@Doe')).toBe(false);
        });

        it('should reject names over 50 characters', () => {
            expect(validateName('A'.repeat(51))).toBe(false);
        });
    });
});

describe('normalizeName', () => {
    it('should capitalize first letter of each word', () => {
        expect(normalizeName('john doe')).toBe('John Doe');
    });

    it('should handle mixed case', () => {
        expect(normalizeName('jOHN DOE')).toBe('John Doe');
    });

    it('should trim whitespace', () => {
        expect(normalizeName('  John  ')).toBe('John');
    });
});

// ============================================================================
// parseVoucherSearch
// ============================================================================

describe('parseVoucherSearch', () => {
    it('should parse single name', () => {
        const result = parseVoucherSearch('Phoenix');
        expect(result.terms).toEqual(['Phoenix']);
        expect(result.raw).toBe('Phoenix');
    });

    it('should parse full name', () => {
        const result = parseVoucherSearch('John Smith');
        expect(result.terms).toEqual(['John', 'Smith']);
    });

    it('should strip "Don" prefix', () => {
        const result = parseVoucherSearch('Don Phoenix');
        expect(result.terms).toEqual(['Phoenix']);
    });

    it('should handle case-insensitive "DON" prefix', () => {
        const result = parseVoucherSearch('DON Phoenix');
        expect(result.terms).toEqual(['Phoenix']);
    });

    it('should handle extra whitespace', () => {
        const result = parseVoucherSearch('  John   Smith  ');
        expect(result.terms).toEqual(['John', 'Smith']);
    });
});

// ============================================================================
// calculateNameMatchScore
// ============================================================================

describe('calculateNameMatchScore', () => {
    const createCandidate = (
        first: string,
        last: string,
        don: string | null
    ): VoucherSearchResult => ({
        discord_id: '123',
        display_name: don ? `Don ${don}` : `${first} ${last}`,
        first_name: first,
        last_name: last,
        don_name: don,
    });

    it('should give highest score to exact don_name match', () => {
        const candidate = createCandidate('John', 'Smith', 'Phoenix');
        const score = calculateNameMatchScore(['Phoenix'], candidate);
        expect(score).toBeGreaterThanOrEqual(100);
    });

    it('should give high score to exact first_name match', () => {
        const candidate = createCandidate('John', 'Smith', null);
        const score = calculateNameMatchScore(['John'], candidate);
        expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should give high score to exact last_name match', () => {
        const candidate = createCandidate('John', 'Smith', null);
        const score = calculateNameMatchScore(['Smith'], candidate);
        expect(score).toBeGreaterThanOrEqual(80);
    });

    it('should give higher score for multiple term matches', () => {
        const candidate = createCandidate('John', 'Smith', null);
        const singleTermScore = calculateNameMatchScore(['John'], candidate);
        const doubleTermScore = calculateNameMatchScore(['John', 'Smith'], candidate);
        expect(doubleTermScore).toBeGreaterThan(singleTermScore);
    });

    it('should give partial score for prefix match', () => {
        const candidate = createCandidate('Jonathan', 'Smith', null);
        const score = calculateNameMatchScore(['Jon'], candidate);
        expect(score).toBeGreaterThan(0);
        expect(score).toBeLessThan(80); // Less than exact match
    });

    it('should return 0 for no match', () => {
        const candidate = createCandidate('John', 'Smith', 'Phoenix');
        const score = calculateNameMatchScore(['Completely', 'Different'], candidate);
        expect(score).toBe(0);
    });
});

// ============================================================================
// validateJobTitle
// ============================================================================

describe('validateJobTitle', () => {
    it('should accept valid job title', () => {
        expect(validateJobTitle('Software Engineer')).toBe(true);
    });

    it('should accept minimum length (2 chars)', () => {
        expect(validateJobTitle('VP')).toBe(true);
    });

    it('should reject too short (1 char)', () => {
        expect(validateJobTitle('A')).toBe(false);
    });

    it('should reject empty string', () => {
        expect(validateJobTitle('')).toBe(false);
    });

    it('should reject over 100 characters', () => {
        expect(validateJobTitle('A'.repeat(101))).toBe(false);
    });
});
