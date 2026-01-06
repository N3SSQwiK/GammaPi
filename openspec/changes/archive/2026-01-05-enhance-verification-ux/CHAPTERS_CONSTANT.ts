/**
 * CHAPTERS CONSTANT - Complete Phi Iota Alpha Chapter List
 *
 * This constant should be added to fiota-bot/src/lib/constants.ts
 *
 * Source: phiota.org/chapters (as of 2025-12-30)
 * Usage: Verification flow chapter dropdown, /chapter-assign command
 *
 * Special Handling:
 * - Gamma Pi appears FIRST in dropdown (graduate chapter priority)
 * - Omega is hidden=true (reserved for deceased brothers, E-Board only)
 * - Satellites are included but marked as type='Satellite' for filtering
 *
 * Maintenance: Review quarterly (Jan, Apr, Jul, Oct) against phiota.org
 * Last Updated: 2025-12-30
 */

export interface Chapter {
    value: string;           // Kebab-case ID for database storage
    label: string;           // Display name (Greek letter)
    institution: string;     // University/College name(s)
    state: string;           // State abbreviation or "National"
    type: 'Undergraduate' | 'Graduate' | 'Satellite' | 'Special';
    hidden: boolean;         // If true, excluded from public verification dropdown
}

export const CHAPTERS: Chapter[] = [
    // GAMMA PI APPEARS FIRST (Graduate Chapter - Top Priority)
    {
        value: 'gamma-pi',
        label: 'Gamma Pi Chapter',
        institution: 'Graduate & Professional',
        state: 'National',
        type: 'Graduate',
        hidden: false
    },

    // UNDERGRADUATE CHAPTERS (Alphabetical by Greek Letter)
    {
        value: 'alpha',
        label: 'Alpha Chapter',
        institution: 'Rensselaer Polytechnic Institute',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta',
        label: 'Beta Chapter',
        institution: 'State University of New York, Stony Brook',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'gamma',
        label: 'Gamma Chapter',
        institution: 'State University of New York, New Paltz',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'delta',
        label: 'Delta Chapter',
        institution: 'State University of New York, Albany',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'epsilon',
        label: 'Epsilon Chapter',
        institution: 'State University of New York, Binghamton',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'zeta',
        label: 'Zeta Chapter',
        institution: 'Hofstra University',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'eta',
        label: 'Eta Chapter',
        institution: 'Union College',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'theta',
        label: 'Theta Chapter',
        institution: 'State University of New York, Old Westbury',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'iota',
        label: 'Iota Chapter',
        institution: 'State University of New York, Oswego',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'kappa',
        label: 'Kappa Chapter',
        institution: 'Syracuse University',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'lambda',
        label: 'Lambda Chapter',
        institution: 'SUNY at Buffalo / Buffalo State College',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'mu',
        label: 'Mu Chapter',
        institution: 'Columbia University',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'nu',
        label: 'Nu Chapter',
        institution: 'Boston College / Boston University / Northeastern University',
        state: 'Massachusetts',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'xi',
        label: 'Xi Chapter',
        institution: 'Harvard University',
        state: 'Massachusetts',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'omicron',
        label: 'Omicron Chapter',
        institution: 'New York University',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'pi',
        label: 'Pi Chapter',
        institution: 'Rochester Institute of Technology / University of Rochester',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'rho',
        label: 'Rho Chapter',
        institution: 'Marist College',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'sigma',
        label: 'Sigma Chapter',
        institution: 'City University of New York',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'tau',
        label: 'Tau Chapter',
        institution: 'Baylor University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'upsilon',
        label: 'Upsilon Chapter',
        institution: 'University of Miami',
        state: 'Florida',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'phi',
        label: 'Phi Chapter',
        institution: 'Michigan State University',
        state: 'Michigan',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'chi',
        label: 'Chi Chapter',
        institution: 'University of Dayton / University of Illinois at Chicago',
        state: 'Illinois',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'psi',
        label: 'Psi Chapter',
        institution: 'Long Island University, C. W. Post Campus',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },

    // OMEGA CHAPTER - HIDDEN (Reserved for Deceased Brothers)
    {
        value: 'omega',
        label: 'Omega Chapter',
        institution: 'Reserved for Deceased Brothers',
        state: '',
        type: 'Special',
        hidden: true  // Only accessible via /chapter-assign command
    },

    // ALPHA-ALPHA THROUGH GAMMA-ALPHA CHAPTERS
    {
        value: 'alpha-alpha',
        label: 'Alpha Alpha Chapter',
        institution: 'Louisiana State University',
        state: 'Louisiana',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-beta',
        label: 'Alpha Beta Chapter',
        institution: 'University of Maryland, College Park',
        state: 'Maryland',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-gamma',
        label: 'Alpha Gamma Chapter',
        institution: 'St. John\'s University',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-delta',
        label: 'Alpha Delta Chapter',
        institution: 'State University of New York, Plattsburgh',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-epsilon',
        label: 'Alpha Epsilon Chapter',
        institution: 'California State University, Dominguez Hills',
        state: 'California',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-zeta',
        label: 'Alpha Zeta Chapter',
        institution: 'Saint Thomas Aquinas College',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-eta',
        label: 'Alpha Eta Chapter',
        institution: 'University of Texas, San Antonio',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-theta',
        label: 'Alpha Theta Chapter',
        institution: 'University of California, Santa Cruz',
        state: 'California',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-iota',
        label: 'Alpha Iota Chapter',
        institution: 'University of Massachusetts Amherst',
        state: 'Massachusetts',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-kappa',
        label: 'Alpha Kappa Chapter',
        institution: 'Villanova University',
        state: 'Pennsylvania',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-lambda',
        label: 'Alpha Lambda Chapter',
        institution: 'University of Arkansas',
        state: 'Arkansas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-mu',
        label: 'Alpha Mu Chapter',
        institution: 'Florida State University',
        state: 'Florida',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-nu',
        label: 'Alpha Nu Chapter',
        institution: 'University of North Texas',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-xi',
        label: 'Alpha Xi Chapter',
        institution: 'University of Texas, Austin',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-omicron',
        label: 'Alpha Omicron Chapter',
        institution: 'Texas State University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-pi',
        label: 'Alpha Pi Chapter',
        institution: 'Georgia Southern University, Armstrong',
        state: 'Georgia',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-rho',
        label: 'Alpha Rho Chapter',
        institution: 'Rutgers University, New Brunswick',
        state: 'New Jersey',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-sigma',
        label: 'Alpha Sigma Chapter',
        institution: 'Georgia Southern University, Statesboro',
        state: 'Georgia',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-tau',
        label: 'Alpha Tau Chapter',
        institution: 'University of California, Santa Barbara',
        state: 'California',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-upsilon',
        label: 'Alpha Upsilon Chapter',
        institution: 'Lamar University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-phi',
        label: 'Alpha Phi Chapter',
        institution: 'Queens College',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-chi',
        label: 'Alpha Chi Chapter',
        institution: 'Lewis University',
        state: 'Illinois',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-psi',
        label: 'Alpha Psi Chapter',
        institution: 'Rutgers University, Newark / NJIT',
        state: 'New Jersey',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'alpha-omega',
        label: 'Alpha Omega Chapter',
        institution: 'Aurora University',
        state: 'Illinois',
        type: 'Undergraduate',
        hidden: false
    },

    // BETA SERIES CHAPTERS
    {
        value: 'beta-alpha',
        label: 'Beta Alpha Chapter',
        institution: 'Utica College',
        state: 'New York',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-beta',
        label: 'Beta Beta Chapter',
        institution: 'California State University, Long Beach',
        state: 'California',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-gamma',
        label: 'Beta Gamma Chapter',
        institution: 'Florida International University',
        state: 'Florida',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-delta',
        label: 'Beta Delta Chapter',
        institution: 'East Texas A&M University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-epsilon',
        label: 'Beta Epsilon Chapter',
        institution: 'Texas A&M University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-zeta',
        label: 'Beta Zeta Chapter',
        institution: 'Denison University',
        state: 'Ohio',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-eta',
        label: 'Beta Eta Chapter',
        institution: 'Grand Valley State University',
        state: 'Michigan',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-theta',
        label: 'Beta Theta Chapter',
        institution: 'University of California, San Diego',
        state: 'California',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-iota',
        label: 'Beta Iota Chapter',
        institution: 'University of South Carolina',
        state: 'South Carolina',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-kappa',
        label: 'Beta Kappa Chapter',
        institution: 'Georgetown University',
        state: 'Washington D.C.',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-lambda',
        label: 'Beta Lambda Chapter',
        institution: 'University of Texas, Rio Grande Valley',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-mu',
        label: 'Beta Mu Chapter',
        institution: 'Texas Tech University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-nu',
        label: 'Beta Nu Chapter',
        institution: 'Western Michigan University',
        state: 'Michigan',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-xi',
        label: 'Beta Xi Chapter',
        institution: 'University of Kansas',
        state: 'Kansas',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-omicron',
        label: 'Beta Omicron Chapter',
        institution: 'Southern Illinois University, Carbondale',
        state: 'Illinois',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-pi',
        label: 'Beta Pi Chapter',
        institution: 'San Francisco State University',
        state: 'California',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-rho',
        label: 'Beta Rho Chapter',
        institution: 'University of New Mexico',
        state: 'New Mexico',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-sigma',
        label: 'Beta Sigma Chapter',
        institution: 'Kennesaw State University',
        state: 'Georgia',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-tau',
        label: 'Beta Tau Chapter',
        institution: 'University of Illinois Urbana Champaign',
        state: 'Illinois',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-upsilon',
        label: 'Beta Upsilon Chapter',
        institution: 'University of Michigan',
        state: 'Michigan',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-phi',
        label: 'Beta Phi Chapter',
        institution: 'Northeastern Illinois University',
        state: 'Illinois',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-chi',
        label: 'Beta Chi Chapter',
        institution: 'George Mason University',
        state: 'Virginia',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-psi',
        label: 'Beta Psi Chapter',
        institution: 'University of Oklahoma',
        state: 'Oklahoma',
        type: 'Undergraduate',
        hidden: false
    },
    {
        value: 'beta-omega',
        label: 'Beta Omega Chapter',
        institution: 'Texas Woman\'s University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },

    // GAMMA ALPHA CHAPTER
    {
        value: 'gamma-alpha',
        label: 'Gamma Alpha Chapter',
        institution: 'Texas A&M International University',
        state: 'Texas',
        type: 'Undergraduate',
        hidden: false
    },

    // SATELLITE CHAPTERS
    {
        value: 'satellite-cincinnati',
        label: 'Satellite - Cincinnati',
        institution: 'Cincinnati City Wide',
        state: 'Ohio',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-emporia',
        label: 'Satellite - Emporia',
        institution: 'Emporia State University',
        state: 'Kansas',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-gwu',
        label: 'Satellite - GWU',
        institution: 'George Washington University',
        state: 'Washington D.C.',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-jhu',
        label: 'Satellite - JHU',
        institution: 'Johns Hopkins University',
        state: 'Maryland',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-nmhu',
        label: 'Satellite - NMHU',
        institution: 'New Mexico Highlands University',
        state: 'New Mexico',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-cortland',
        label: 'Satellite - Cortland',
        institution: 'State University of New York, Cortland',
        state: 'New York',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-farmingdale',
        label: 'Satellite - Farmingdale',
        institution: 'State University of New York, Farmingdale',
        state: 'New York',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-csula',
        label: 'Satellite - CSULA',
        institution: 'California State University, Los Angeles',
        state: 'California',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-uca',
        label: 'Satellite - UCA',
        institution: 'University of Central Arkansas',
        state: 'Arkansas',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-uchicago',
        label: 'Satellite - UChicago',
        institution: 'University of Chicago',
        state: 'Illinois',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-asu',
        label: 'Satellite - ASU',
        institution: 'Arizona State University',
        state: 'Arizona',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-newberry',
        label: 'Satellite - Newberry',
        institution: 'Newberry College',
        state: 'South Carolina',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-ilstu',
        label: 'Satellite - ISU',
        institution: 'Illinois State University',
        state: 'Illinois',
        type: 'Satellite',
        hidden: false
    },
    {
        value: 'satellite-indiana',
        label: 'Satellite - Indiana',
        institution: 'University of Indiana - Bloomington',
        state: 'Indiana',
        type: 'Satellite',
        hidden: false
    }
];

/**
 * Helper function to get chapters for verification dropdown
 * Filters out hidden chapters (Omega) and returns Gamma Pi first
 *
 * @returns Array of chapters for Discord select menu, Gamma Pi first
 */
export function getVerificationChapters(): Chapter[] {
    return CHAPTERS.filter(ch => !ch.hidden);
}

/**
 * Helper function to get all chapters including hidden (for E-Board commands)
 *
 * @returns Complete array of all chapters including Omega
 */
export function getAllChapters(): Chapter[] {
    return CHAPTERS;
}

/**
 * Helper function to validate chapter input
 *
 * @param input - Chapter value from user input
 * @returns true if valid chapter exists, false otherwise
 */
export function validateChapter(input: string): boolean {
    return CHAPTERS.some(ch => ch.value.toLowerCase() === input.toLowerCase());
}

/**
 * Helper function to format chapter select menu options
 *
 * @returns Array formatted for Discord StringSelectMenu
 */
export function getChapterSelectOptions() {
    return getVerificationChapters().map(ch => ({
        label: ch.label,
        value: ch.value,
        description: `${ch.institution} - ${ch.state}`.substring(0, 100) // Discord 100 char limit
    }));
}
