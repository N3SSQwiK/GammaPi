/**
 * INDUSTRIES CONSTANT - 50 NAICS-Based Professional Categories
 *
 * This constant should be added to fiota-bot/src/lib/constants.ts
 *
 * Source: Simplified from NAICS (North American Industry Classification System)
 * Usage: Verification flow industry dropdown, /find command filtering
 *
 * Maintenance: E-Board can request additions if >3 brothers fall into "Other"
 * Last Updated: 2025-12-30
 */

export const INDUSTRIES = [
    'Accounting / Auditing',
    'Aerospace / Defense',
    'Agriculture / Food Production',
    'Architecture / Urban Planning',
    'Arts / Entertainment / Media Production',
    'Automotive / Transportation Manufacturing',
    'Banking / Financial Services',
    'Biotechnology / Life Sciences',
    'Construction / Contractors',
    'Consulting (Business / Management)',
    'Consulting (Technology / IT)',
    'Education / Academia (K-12)',
    'Education / Academia (Higher Ed)',
    'Energy / Oil & Gas',
    'Engineering (Civil)',
    'Engineering (Electrical / Computer)',
    'Engineering (Mechanical / Industrial)',
    'Environmental Services / Sustainability',
    'Fashion / Apparel / Textiles',
    'Government / Public Administration (Federal)',
    'Government / Public Administration (State / Local)',
    'Healthcare / Medical (Clinical Practice)',
    'Healthcare / Medical (Hospital Administration)',
    'Healthcare / Medical (Research)',
    'Hospitality / Hotels / Tourism',
    'Human Resources / Talent Acquisition',
    'Insurance / Risk Management',
    'Legal / Law (Corporate)',
    'Legal / Law (Criminal / Public Interest)',
    'Logistics / Supply Chain',
    'Manufacturing (Industrial / Heavy)',
    'Marketing / Advertising / PR',
    'Military / Veterans Services',
    'Non-Profit / Social Services',
    'Pharmaceutical / Drug Development',
    'Real Estate / Property Management',
    'Research / Think Tanks',
    'Restaurant / Food Service',
    'Retail / E-Commerce',
    'Sales (B2B / Enterprise)',
    'Sales (Consumer / Retail)',
    'Technology / Cybersecurity',
    'Technology / Data Science / Analytics',
    'Technology / Hardware / Semiconductors',
    'Technology / Software Engineering',
    'Telecommunications',
    'Transportation / Logistics',
    'Utilities (Electric / Water / Gas)',
    'Venture Capital / Private Equity',
    'Other (please specify in profile notes)'
] as const;

/**
 * INDUSTRY MIGRATION MAP - Maps free-text variations to standardized values
 *
 * Used during data migration to convert existing free-form industry entries
 * to new standardized INDUSTRIES values.
 *
 * Usage: Run migration script once during deployment
 */
export const INDUSTRY_MIGRATION_MAP: Record<string, string> = {
    // Technology variations
    'Tech / Software Engineer': 'Technology / Software Engineering',
    'Software': 'Technology / Software Engineering',
    'SWE': 'Technology / Software Engineering',
    'Software Engineer': 'Technology / Software Engineering',
    'Software Developer': 'Technology / Software Engineering',
    'Tech': 'Technology / Software Engineering',
    'Technology': 'Technology / Software Engineering',
    'IT': 'Consulting (Technology / IT)',
    'Cybersecurity': 'Technology / Cybersecurity',
    'Data Science': 'Technology / Data Science / Analytics',
    'Data Analyst': 'Technology / Data Science / Analytics',

    // Finance variations
    'Finance': 'Banking / Financial Services',
    'Banking': 'Banking / Financial Services',
    'Investment Banking': 'Banking / Financial Services',
    'Wealth Management': 'Banking / Financial Services',
    'VC': 'Venture Capital / Private Equity',
    'Private Equity': 'Venture Capital / Private Equity',

    // Healthcare variations
    'Healthcare': 'Healthcare / Medical (Clinical Practice)',
    'Medical': 'Healthcare / Medical (Clinical Practice)',
    'Doctor': 'Healthcare / Medical (Clinical Practice)',
    'Physician': 'Healthcare / Medical (Clinical Practice)',
    'Nurse': 'Healthcare / Medical (Clinical Practice)',
    'Hospital': 'Healthcare / Medical (Hospital Administration)',
    'Pharma': 'Pharmaceutical / Drug Development',

    // Legal variations
    'Law': 'Legal / Law (Corporate)',
    'Legal': 'Legal / Law (Corporate)',
    'Attorney': 'Legal / Law (Corporate)',
    'Lawyer': 'Legal / Law (Corporate)',

    // Education variations
    'Education': 'Education / Academia (Higher Ed)',
    'Teacher': 'Education / Academia (K-12)',
    'Professor': 'Education / Academia (Higher Ed)',
    'Academia': 'Education / Academia (Higher Ed)',

    // Government variations
    'Government': 'Government / Public Administration (Federal)',
    'Public Service': 'Government / Public Administration (Federal)',
    'Federal': 'Government / Public Administration (Federal)',
    'State Government': 'Government / Public Administration (State / Local)',
    'Military': 'Military / Veterans Services',

    // Engineering variations
    'Engineering': 'Engineering (Mechanical / Industrial)',
    'Civil Engineering': 'Engineering (Civil)',
    'Electrical Engineering': 'Engineering (Electrical / Computer)',
    'Computer Engineering': 'Engineering (Electrical / Computer)',
    'Mechanical Engineering': 'Engineering (Mechanical / Industrial)',

    // Business / Consulting variations
    'Consulting': 'Consulting (Business / Management)',
    'Management Consulting': 'Consulting (Business / Management)',
    'Strategy': 'Consulting (Business / Management)',

    // Sales / Marketing variations
    'Sales': 'Sales (B2B / Enterprise)',
    'Marketing': 'Marketing / Advertising / PR',
    'Advertising': 'Marketing / Advertising / PR',
    'PR': 'Marketing / Advertising / PR)',

    // Non-Profit variations
    'Non-Profit': 'Non-Profit / Social Services',
    'Nonprofit': 'Non-Profit / Social Services',
    'Social Work': 'Non-Profit / Social Services',

    // Real Estate variations
    'Real Estate': 'Real Estate / Property Management',
    'Property Management': 'Real Estate / Property Management',

    // Retail variations
    'Retail': 'Retail / E-Commerce',
    'E-Commerce': 'Retail / E-Commerce',
    'eCommerce': 'Retail / E-Commerce',

    // Add more mappings as patterns emerge from existing data
};

/**
 * Helper function to migrate old industry value to new standardized value
 *
 * @param oldIndustry - Free-text industry from existing database
 * @returns Standardized industry from INDUSTRIES constant or 'Other'
 */
export function migrateIndustry(oldIndustry: string): string {
    // Exact match in migration map
    if (INDUSTRY_MIGRATION_MAP[oldIndustry]) {
        return INDUSTRY_MIGRATION_MAP[oldIndustry];
    }

    // Case-insensitive partial match
    const oldLower = oldIndustry.toLowerCase();
    for (const [key, value] of Object.entries(INDUSTRY_MIGRATION_MAP)) {
        if (oldLower.includes(key.toLowerCase()) || key.toLowerCase().includes(oldLower)) {
            return value;
        }
    }

    // No match found - categorize as "Other" and log for manual review
    console.log(`[Migration] Unmapped industry: "${oldIndustry}" → "Other"`);
    return 'Other (please specify in profile notes)';
}

/**
 * Example validation function for industry input
 *
 * @param industry - Industry string from user input or database
 * @returns true if valid industry, false otherwise
 */
export function validateIndustry(industry: string): boolean {
    return INDUSTRIES.includes(industry as any);
}
