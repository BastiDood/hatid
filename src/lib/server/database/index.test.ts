import * as db from '.';
import { afterAll, describe, expect, it } from 'vitest';
import { getRandomValues, randomUUID } from 'node:crypto';

afterAll(() => db.end());

it('should complete a full user journey', async () => {
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
    
    expect(await db.isAdminSession(session_id)).toStrictEqual(false);
    expect(await db.setAdminForUser(uid, true)).toStrictEqual(false);
    expect(await db.isAdminSession(session_id)).toStrictEqual(true);
    expect(await db.setAdminForUser(uid, false)).toStrictEqual(true);
    expect(await db.isAdminSession(session_id)).toStrictEqual(false);

    const did = await db.createDept('Full User Journey');
    expect(await db.isHeadSession(randomUUID(), 0)).toBeNull();
    expect(await db.isHeadSession(randomUUID(), did)).toBeNull();
    expect(await db.isHeadSession(session_id, 0)).toBeNull();
    expect(await db.isHeadSession(session_id, did)).toBeNull();
 
    expect(await db.addDeptAgent(did, randomUUID(), true)).toStrictEqual(false);
    expect(await db.addDeptAgent(0, uid, true)).toStrictEqual(false);
    expect(await db.addDeptAgent(did, uid, false)).toStrictEqual(true);
    // Assumption: setAdminForUser (thus setHeadForAgent) returns old admin/head value
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(false);
    expect(await db.setHeadForAgent(did, uid, true)).toStrictEqual(false);
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(true);
    expect(await db.setHeadForAgent(did, uid, false)).toStrictEqual(true);
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(false);
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

it('should create and update priorities', async () => {
    const bytes = getRandomValues(new Uint8Array(21));
    const priority = Buffer.from(bytes).toString('base64');
    const pid = await db.createPriority(priority, 0);
    expect(pid).not.toStrictEqual(0);
    // TODO: update priority properties here
});

describe.concurrent('invalid labels', () => {
    // NOTE: Postgres does not provide 0 as a valid `SERIAL`.
    it('should reject title update', async ({ expect }) => {
        const result = await db.editLabelTitle(0, 'World Hello');
        expect(result).toStrictEqual(false);
    });
    it('should reject color update', async ({ expect }) => {
        const result = await db.editLabelColor(0, 0xdeadbeef);
        expect(result).toStrictEqual(false);
    });
    it('should reject color update', async ({ expect }) => {
        expect(await db.editLabelDeadline(0, null)).toStrictEqual(false);
        expect(await db.editLabelDeadline(0, 5)).toStrictEqual(false);
    });
});

it('should create departments and update their names', async () => {
    const did = await db.createDept('HATiD Support');
    expect(did).not.toStrictEqual(0);
    expect(await db.editDeptName(did, 'PUSO/BULSA Support')).toStrictEqual(true);
});

describe.concurrent('invalid sessions', () => {
    const sid = randomUUID();
    it('should be null when fetching', async ({ expect }) => {
        const val = await db.getUserFromSession(sid);
        expect(val).toBeNull();
    });
    it('should be null checking admin permissions', async ({ expect }) => {
        const val = await db.isAdminSession(sid);
        expect(val).toBeNull();
    });
    it('should be null when deleting', async ({ expect }) => {
        const val = await db.begin(sql => sql.deletePending(sid));
        expect(val).toBeNull();
    });
});

describe('invalid departments', () => {
    // NOTE: As above, 0 is not a valid value in Postgres
    it('should not edit the department name', async () => {
        const result = await db.editDeptName(0, 'Non-existent Support');
        expect(result).toStrictEqual(false);
    });
});
