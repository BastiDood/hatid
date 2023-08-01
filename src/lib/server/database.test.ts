import * as db from './database';
import { afterAll, describe, expect, it } from 'vitest';
import { getRandomValues, randomUUID } from 'node:crypto';

afterAll(() => db.end());

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
        const uid = randomUUID();
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

it('should create a new label', async () => {
    const id = await db.createLabel('Hello World', 0xc0debabe);
    expect(id).not.toStrictEqual(0);
});

describe('invalid sessions', () => {
    it('should be null when fetching', async () => {
        const val = await db.getUserFromSession(randomUUID());
        expect(val).toBeNull();
    });
    it('should be null when deleting', async () => {
        const val = await db.begin(sql => sql.deletePending(randomUUID()));
        expect(val).toBeNull();
    });
});
