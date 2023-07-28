import * as db from '$lib/database';
import { afterAll, describe, expect, it } from 'vitest';
import { getRandomValues } from 'node:crypto';

afterAll(() => db.end());

describe('database wrapper tests', () => {
    it('should create a new session', async () => {
        const { session_id, nonce, expiration } = await db.createPending();
        expect(session_id).toBeTruthy();
        expect(nonce).length(64);
        expect(expiration.getTime()).toBeGreaterThanOrEqual(Date.now());

        const pending = await db.getUserFromSession(session_id);
        expect(pending).toBeNull();

        const val = await db.begin(sql => sql.deletePending(session_id));
        expect(val).toEqual({ nonce, expiration });

        const stillPending = await db.getUserFromSession(session_id);
        expect(stillPending).toBeNull();

        await db.begin(async sql => {
            const uid = crypto.randomUUID();
            const bytes = getRandomValues(new Uint8Array(21));
            const email = Buffer.from(bytes).toString('base64');
            await sql.upsertUser({
                user_id: uid,
                name: 'Test',
                email: `${email}@example.com`,
                picture: 'http://example.com/avatar.png',
            });
            await sql.upgradePending(session_id, uid, new Date(Date.now() + 10000));
        });

        const valid = await db.getUserFromSession(session_id);
        expect(valid).not.toBeNull();
    });

    it('should receive null when fetching invalid sessions', async () => {
        const sid = crypto.randomUUID();
        const val = await db.getUserFromSession(sid);
        expect(val).toBeNull();
    });

    it('should receive null when deleting invalid sessions', async () => {
        const sid = crypto.randomUUID();
        const val = await db.begin(sql => sql.deletePending(sid));
        expect(val).toBeNull();
    });
});
