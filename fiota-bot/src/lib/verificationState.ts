/**
 * Shared state for multi-step verification flow
 *
 * We store this server-side instead of encoding in Discord customIds because:
 * 1. Discord customId has a 100-char limit
 * 2. Base64-encoded JSON payloads can exceed this limit
 * 3. Server-side state is more reliable and secure
 */

export interface PendingVerifyStart {
    chapter: string;
    industry: string;
    expiresAt: number;
}

export interface PendingVerification {
    chapter: string;
    industry: string;
    firstName: string;
    lastName: string;
    donName: string;
    yearSemester: { year: number; semester: 'Spring' | 'Fall' };
    jobTitle: string;
    expiresAt: number;
}

// Pre-modal-1 data (chapter/industry from /verify-start command)
export const pendingVerifyStarts = new Map<string, PendingVerifyStart>();

// Post-modal-1 data (identity info, waiting for modal 2)
export const pendingVerifications = new Map<string, PendingVerification>();

// Clean up expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();

    for (const [key, value] of pendingVerifyStarts) {
        if (value.expiresAt < now) {
            pendingVerifyStarts.delete(key);
        }
    }

    for (const [key, value] of pendingVerifications) {
        if (value.expiresAt < now) {
            pendingVerifications.delete(key);
        }
    }
}, 5 * 60 * 1000);
