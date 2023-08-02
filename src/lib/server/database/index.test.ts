import * as db from '.';
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

    const uid = await db.begin(async sql => {
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
        return uid;
    });

    const valid = await db.getUserFromSession(session_id);
    expect(valid?.user_id).toStrictEqual(uid);

    expect(await db.setAdminForUser(uid, true)).toStrictEqual(false);
    expect(await db.setAdminForUser(uid, false)).toStrictEqual(true);
});

it('should reject promoting non-existent users', async () => {
    const uid = randomUUID();
    expect(await db.setAdminForUser(uid, true)).toBeNull();
    expect(await db.setAdminForUser(uid, false)).toBeNull();
});

it('should create and update labels', async () => {
    const lid = await db.createLabel('Hello World', 0xc0debabe, null);
    expect(lid).not.toStrictEqual(0);

    const other = await db.createLabel('Hello World', 0xc0debabe, 10);
    expect(other).not.toStrictEqual(0);

    expect(await db.editLabelTitle(lid, 'World Hello')).toStrictEqual(true);
    expect(await db.editLabelColor(lid, 0xdeadbeef)).toStrictEqual(true);
    expect(await db.editLabelDeadline(lid, null)).toStrictEqual(true);
    expect(await db.editLabelDeadline(lid, 5)).toStrictEqual(true);
});

it('should reject updating invalid labels', async () => {
    // NOTE: Postgres does not provide 0 as a valid `SERIAL`.
    expect(await db.editLabelTitle(0, 'World Hello')).toStrictEqual(false);
    expect(await db.editLabelColor(0, 0xdeadbeef)).toStrictEqual(false);
    expect(await db.editLabelDeadline(0, null)).toStrictEqual(false);
    expect(await db.editLabelDeadline(0, 5)).toStrictEqual(false);
});

it('should create a new department', async () => {
    const id = await db.createDept('HATiD Support');
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
