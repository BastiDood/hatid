import { afterAll, describe, expect, it } from 'vitest';
import Database from '$lib/database';

// Get database credentials from environment variables.
const db = new Database();
afterAll(() => db.end());

describe('database wrapper tests', () => {
    it('should create a new session', async () => {
        const { session_id, nonce, expiration } = await db.createSession();
        expect(session_id).toBeTruthy();
        expect(nonce).length(64);
        expect(expiration.getTime()).toBeGreaterThanOrEqual(Date.now());
    });
});
