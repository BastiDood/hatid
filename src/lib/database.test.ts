import * as db from '$lib/database';
import { afterAll, describe, expect, it } from 'vitest';

afterAll(() => db.end());

describe('database wrapper tests', () => {
    it('should create a new session', async () => {
        const { session_id, nonce, expiration } = await db.createSession();
        expect(session_id).toBeTruthy();
        expect(nonce).length(64);
        expect(expiration.getTime()).toBeGreaterThanOrEqual(Date.now());
    });
});
