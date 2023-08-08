import * as db from '.';
import { afterAll, assert, describe, expect, it } from 'vitest';
import { getRandomValues, randomUUID } from 'node:crypto';

afterAll(() => db.end());

it('should complete a full user journey', async () => {
    const { session_id, nonce, expiration } = await db.createPending();
    expect(session_id).toBeTruthy();
    expect(nonce).length(64);
    expect(expiration.getTime()).toBeGreaterThanOrEqual(Date.now());

    {
        const pending = await db.getUserFromSession(session_id);
        expect(pending).toBeNull();
    }

    {
        const val = await db.begin(sql => sql.deletePending(session_id));
        expect(val).toEqual({ nonce, expiration });
    }

    {
        const stillPending = await db.getUserFromSession(session_id);
        expect(stillPending).toBeNull();
    }

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

    {
        const valid = await db.getUserFromSession(session_id);
        expect(valid?.user_id).toStrictEqual(uid);
    }

    expect(await db.isAdminSession(session_id)).toStrictEqual(false);
    expect(await db.setAdminForUser(uid, true)).toStrictEqual(false);
    expect(await db.isAdminSession(session_id)).toStrictEqual(true);
    expect(await db.setAdminForUser(uid, false)).toStrictEqual(true);
    expect(await db.isAdminSession(session_id)).toStrictEqual(false);

    const did = await db.createDept('Full User Journey');
    const nonExistentUser = randomUUID();
    expect(await db.isHeadSession(nonExistentUser, 0)).toBeNull();
    expect(await db.isHeadSession(nonExistentUser, did)).toBeNull();
    expect(await db.isHeadSession(session_id, 0)).toBeNull();
    expect(await db.isHeadSession(session_id, did)).toBeNull();

    expect(await db.addDeptAgent(0, nonExistentUser)).toStrictEqual(db.AddDeptAgentResult.NoDept);
    expect(await db.addDeptAgent(did, nonExistentUser)).toStrictEqual(db.AddDeptAgentResult.NoUser);
    expect(await db.addDeptAgent(0, uid)).toStrictEqual(db.AddDeptAgentResult.NoDept);
    expect(await db.addDeptAgent(did, uid)).toStrictEqual(db.AddDeptAgentResult.Success);
    expect(await db.addDeptAgent(did, uid)).toStrictEqual(db.AddDeptAgentResult.AlreadyExists);

    expect(await db.removeDeptAgent(0, nonExistentUser)).toBeNull();
    expect(await db.removeDeptAgent(did, nonExistentUser)).toBeNull();
    expect(await db.removeDeptAgent(0, uid)).toBeNull();
    expect(await db.removeDeptAgent(did, uid)).toStrictEqual(false);
    // TODO: add test case when the agent is actually the department head
    expect(await db.addDeptAgent(did, uid)).toStrictEqual(db.AddDeptAgentResult.Success);

    expect(await db.isHeadSession(session_id, did)).toStrictEqual(false);
    expect(await db.setHeadForAgent(did, uid, true)).toStrictEqual(false);
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(true);
    expect(await db.setHeadForAgent(did, uid, false)).toStrictEqual(true);
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(false);

    {
        // Invalid user with no labels
        const result = await db.createTicket('Invalid User', nonExistentUser, 'oof', []);
        expect(result).toStrictEqual(db.CreateTicketResult.NoAuthor);
    }

    {
        // Valid user with invalid label
        const result = await db.createTicket('Invalid Label', uid, 'oof', [0]);
        expect(result).toStrictEqual(db.CreateTicketResult.NoLabels);
    }

    const nonExistentTicket = randomUUID();
    {
        // Valid user with no labels
        const result = await db.createTicket('No Labels', uid, 'oof', []);
        assert(typeof result === 'object');
        const { tid, mid, due } = result;
        expect(tid).toHaveLength(36);
        expect(mid).not.toStrictEqual(0);
        expect(due.getTime()).toBeGreaterThanOrEqual(Date.now());

        expect(await db.isTicketAuthor(nonExistentTicket, nonExistentUser)).toBeNull();
        expect(await db.isTicketAuthor(nonExistentTicket, uid)).toBeNull();
        expect(await db.isTicketAuthor(tid, nonExistentUser)).toStrictEqual(false);
        expect(await db.isTicketAuthor(tid, uid)).toStrictEqual(true);
    }

    const coolLabel = await db.createLabel('Cool', 0xc0debeef);

    {
        // Invalid user with one label
        const result = await db.createTicket('Invalid User', nonExistentUser, 'oof', [coolLabel]);
        expect(result).toStrictEqual(db.CreateTicketResult.NoAuthor);
    }

    {
        // Create ticket and edit its title
        const result = await db.createTicket('Old title', uid, 'Hello World', [coolLabel]);
        assert(typeof result === 'object');
        const { tid, mid, due } = result;
        expect(tid).toHaveLength(36);
        expect(mid).not.toStrictEqual(0);
        expect(due.getTime()).toBeGreaterThanOrEqual(Date.now());

        expect(await db.canEditTicketTitle(nonExistentTicket, nonExistentUser)).toBeNull();
        expect(await db.canEditTicketTitle(nonExistentTicket, uid)).toBeNull();
        expect(await db.canEditTicketTitle(tid, nonExistentUser)).toStrictEqual(false);
        expect(await db.canEditTicketTitle(tid, uid)).toStrictEqual(true);
        // TODO: add test case when the agent actually does have permission
        expect(await db.editTicketTitle(tid, 'New Title')).toStrictEqual(true);

        {
            const result = await db.editTicketDueDate(nonExistentTicket, new Date());
            expect(result).toBeNull();
        }

        {
            const result = await db.editTicketDueDate(tid, new Date());
            expect(result).toStrictEqual(false);
        }

        {
            const due = new Date();
            const future = due.getDate() + 5;
            due.setDate(future);
            const result = await db.editTicketDueDate(tid, due);
            expect(result).toStrictEqual(true);
        }

        {
            const result = await db.editTicketDueDate(tid);
            expect(result).toStrictEqual(true);
        }
    }

    expect(await db.subscribeDeptToLabel(0, 0)).toStrictEqual(db.SubscribeDeptToLabelResult.NoDept);

    {
        const result = await db.subscribeDeptToLabel(0, coolLabel);
        expect(result).toStrictEqual(db.SubscribeDeptToLabelResult.NoDept);
    }

    {
        const result = await db.subscribeDeptToLabel(did, 0);
        expect(result).toStrictEqual(db.SubscribeDeptToLabelResult.NoLabel);
    }

    {
        const result = await db.subscribeDeptToLabel(did, coolLabel);
        expect(result).toStrictEqual(db.SubscribeDeptToLabelResult.Success);
    }

    {
        const result = await db.subscribeDeptToLabel(did, coolLabel);
        expect(result).toStrictEqual(db.SubscribeDeptToLabelResult.Exists);
    }

    {
        const result = await db.createReply(
            nonExistentTicket,
            nonExistentUser,
            'No Ticket and User',
        );
        expect(result).toStrictEqual(db.CreateReplyResult.NoTicket);
    }

    // Valid user with labels
    const createTicketResult = await db.createTicket('With Label', uid, 'yay!', [coolLabel]);
    assert(typeof createTicketResult === 'object');
    const { tid, mid, due } = createTicketResult;
    expect(tid).toHaveLength(36);
    expect(mid).not.toStrictEqual(0);
    expect(due.getTime()).toBeGreaterThanOrEqual(Date.now());

    expect(await db.isTicketAuthor(nonExistentTicket, nonExistentUser)).toStrictEqual(null);
    expect(await db.isTicketAuthor(nonExistentTicket, uid)).toStrictEqual(null);
    expect(await db.isTicketAuthor(tid, nonExistentUser)).toStrictEqual(false);
    expect(await db.isTicketAuthor(tid, uid)).toStrictEqual(true);

    {
        const result = await db.createReply(tid, nonExistentUser, 'No User');
        expect(result).toStrictEqual(db.CreateReplyResult.NoUser);
    }

    {
        const result = await db.createReply(nonExistentTicket, uid, 'No Ticket');
        expect(result).toStrictEqual(db.CreateReplyResult.NoTicket);
    }

    // TODO: Add test for attempting to reply to a closed ticket

    const replyId = await db.createReply(tid, uid, 'Valid Reply');
    assert(typeof replyId === 'number');
    expect(replyId).not.toStrictEqual(0);
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

    expect(await db.editPriorityTitle(pid, `${priority}-1`)).toStrictEqual(true);
    expect(await db.editPriorityLevel(pid, 2)).toStrictEqual(true);
});

describe.concurrent('invalid priorities', () => {
    it('should reject title update', async ({ expect }) => {
        const result = await db.editPriorityTitle(0, 'Simple');
        expect(result).toStrictEqual(false);
    });
    it('should reject priority update', async ({ expect }) => {
        const result = await db.editPriorityLevel(0, 1);
        expect(result).toStrictEqual(false);
    });
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
