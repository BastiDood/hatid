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

    const { uid, email } = await db.begin(async sql => {
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
        return { uid, email };
    });

    const nonExistentSession = randomUUID();
    expect(await db.getUserFromSession(nonExistentSession)).toBeNull();

    {
        const users = await db.getUsers();
        expect(users).toContainEqual({
            user_id: uid,
            name: 'Test',
            email: `${email}@example.com`,
            picture: 'http://example.com/avatar.png',
            admin: false,
        });
    }

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
    expect(did).not.toStrictEqual(0);

    {
        const depts = await db.getDepartments();
        expect(depts).toContainEqual({ dept_id: did, name: 'Full User Journey' });
    }

    const nonExistentUser = randomUUID();
    expect(await db.isHeadSession(nonExistentSession, 0)).toBeNull();
    expect(await db.isHeadSession(nonExistentSession, did)).toBeNull();
    expect(await db.isHeadSession(session_id, 0)).toBeNull();
    expect(await db.isHeadSession(session_id, did)).toBeNull();

    const nonExistentTicket = randomUUID();
    expect(await db.isAssignableAgent(nonExistentTicket, 0, nonExistentUser)).toBeNull();
    expect(await db.isAssignableAgent(nonExistentTicket, 0, uid)).toBeNull();
    expect(await db.isAssignableAgent(nonExistentTicket, did, nonExistentUser)).toBeNull();
    expect(await db.isAssignableAgent(nonExistentTicket, did, uid)).toBeNull();

    expect(await db.addDeptAgent(0, nonExistentUser)).toStrictEqual(db.AddDeptAgentResult.NoDept);
    expect(await db.addDeptAgent(did, nonExistentUser)).toStrictEqual(db.AddDeptAgentResult.NoUser);
    expect(await db.addDeptAgent(0, uid)).toStrictEqual(db.AddDeptAgentResult.NoDept);
    expect(await db.addDeptAgent(did, uid)).toStrictEqual(db.AddDeptAgentResult.Success);
    expect(await db.addDeptAgent(did, uid)).toStrictEqual(db.AddDeptAgentResult.AlreadyExists);

    {
        const agents = await db.getAgentsByDept(did);
        const ids = agents.map(u => u.user_id);
        expect(ids).toContainEqual(uid);
    }

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

    const label = Buffer.from(getRandomValues(new Uint8Array(21))).toString('base64');
    const coolLabel = await db.createLabel(label, 0xc0debeef);
    assert(coolLabel !== null && coolLabel !== 0);

    {
        const labels = await db.getLabels();
        expect(labels).toContainEqual({
            label_id: coolLabel,
            title: label,
            color: 0xc0debeef,
            deadline: null,
        });
    }

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

        {
            const assignment = await db.assignTicketLabel(nonExistentTicket, 0);
            expect(assignment).toStrictEqual(db.AssignTicketLabelResult.NoTicket);
        }

        {
            const assignment = await db.assignTicketLabel(nonExistentTicket, coolLabel);
            expect(assignment).toStrictEqual(db.AssignTicketLabelResult.NoTicket);
        }

        {
            const assignment = await db.assignTicketLabel(tid, 0);
            expect(assignment).toStrictEqual(db.AssignTicketLabelResult.NoLabel);
        }

        {
            const assignment = await db.assignTicketLabel(tid, coolLabel);
            expect(assignment).toStrictEqual(db.AssignTicketLabelResult.Success);
        }

        {
            const assignment = await db.assignTicketLabel(tid, coolLabel);
            expect(assignment).toStrictEqual(db.AssignTicketLabelResult.AlreadyExists);
        }
    }

    {
        // Invalid user with one label
        const result = await db.createTicket('Invalid User', nonExistentUser, 'oof', [coolLabel]);
        expect(result).toStrictEqual(db.CreateTicketResult.NoAuthor);
    }

    {
        // Create ticket and edit its title
        const result = await db.createTicket('Old Title', uid, 'Hello World', [coolLabel]);
        assert(typeof result === 'object');
        const { tid, mid, due } = result;
        expect(tid).toHaveLength(36);
        expect(mid).not.toStrictEqual(0);
        expect(due.getTime()).toBeGreaterThanOrEqual(Date.now());

        expect(await db.canEditTicket(nonExistentTicket, nonExistentUser)).toBeNull();
        expect(await db.canEditTicket(nonExistentTicket, uid)).toBeNull();
        expect(await db.canEditTicket(tid, nonExistentUser)).toBeNull();
        // TODO: add test case for existent user that cannot edit ticket
        expect(await db.canEditTicket(tid, uid)).toStrictEqual(true);
        // TODO: add test case when the agent actually does have permission
        expect(await db.editTicketTitle(tid, 'New Title')).toStrictEqual(true);

        {
            // Creates a priority, then assigned agent sets ticket priority
            const bytes = getRandomValues(new Uint8Array(21));
            const priority = Buffer.from(bytes).toString('base64');
            const pid = await db.createPriority(priority, 0);
            expect(pid).not.toStrictEqual(0);

            {
                const result = await db.assignTicketPriority(nonExistentTicket, 0);
                expect(result).toStrictEqual(db.AssignTicketPriorityResult.NoTicket);
            }

            {
                const result = await db.assignTicketPriority(nonExistentTicket, pid);
                expect(result).toStrictEqual(db.AssignTicketPriorityResult.NoTicket);
            }

            {
                const result = await db.assignTicketPriority(tid, 0);
                expect(result).toStrictEqual(db.AssignTicketPriorityResult.NoPriority);
            }

            {
                const result = await db.assignTicketPriority(tid, pid);
                expect(result).toStrictEqual(db.AssignTicketPriorityResult.Success);
            }
        }

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

    expect(await db.isTicketAuthor(nonExistentTicket, nonExistentUser)).toBeNull();
    expect(await db.isTicketAuthor(nonExistentTicket, uid)).toBeNull();
    expect(await db.isTicketAuthor(tid, nonExistentUser)).toStrictEqual(false);
    expect(await db.isTicketAuthor(tid, uid)).toStrictEqual(true);

    expect(await db.isAssignableAgent(nonExistentTicket, 0, nonExistentUser)).toBeNull();
    expect(await db.isAssignableAgent(nonExistentTicket, 0, uid)).toBeNull();
    expect(await db.isAssignableAgent(nonExistentTicket, did, nonExistentUser)).toBeNull();
    expect(await db.isAssignableAgent(nonExistentTicket, did, uid)).toBeNull();
    expect(await db.isAssignableAgent(tid, 0, nonExistentUser)).toBeNull();
    expect(await db.isAssignableAgent(tid, 0, uid)).toBeNull();
    expect(await db.isAssignableAgent(tid, did, nonExistentUser)).toStrictEqual(false);
    expect(await db.isAssignableAgent(tid, did, uid)).toStrictEqual(true);

    {
        const result = await db.assignAgentToTicket(nonExistentTicket, 0, nonExistentUser);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoTicket);
    }

    {
        const result = await db.assignAgentToTicket(nonExistentTicket, 0, uid);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoTicket);
    }

    {
        const result = await db.assignAgentToTicket(nonExistentTicket, did, nonExistentUser);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoTicket);
    }

    {
        const result = await db.assignAgentToTicket(nonExistentTicket, did, uid);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoTicket);
    }

    {
        const result = await db.assignAgentToTicket(tid, 0, nonExistentUser);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoAgent);
    }

    {
        const result = await db.assignAgentToTicket(tid, 0, uid);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoAgent);
    }

    {
        const result = await db.assignAgentToTicket(tid, did, nonExistentUser);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.NoAgent);
    }

    {
        const result = await db.assignAgentToTicket(tid, did, uid);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.Success);
    }

    {
        const result = await db.assignAgentToTicket(tid, did, uid);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.Exists);
    }

    {
        const result = await db.createReply(tid, nonExistentUser, 'No User');
        expect(result).toStrictEqual(db.CreateReplyResult.NoUser);
    }

    {
        const result = await db.createReply(nonExistentTicket, uid, 'No Ticket');
        expect(result).toStrictEqual(db.CreateReplyResult.NoTicket);
    }

    {
        expect(await db.removeTicketAgent(tid, did, uid)).toStrictEqual(true);
        const result = await db.assignAgentToTicket(tid, did, uid);
        expect(result).toStrictEqual(db.AssignAgentToTicketResult.Success);
    }

    expect(await db.removeTicketAgent(nonExistentTicket, 0, nonExistentUser)).toStrictEqual(false);
    expect(await db.removeTicketAgent(nonExistentTicket, 0, uid)).toStrictEqual(false);

    {
        const result = await db.removeTicketAgent(nonExistentTicket, did, nonExistentUser);
        expect(result).toStrictEqual(false);
    }

    expect(await db.removeTicketAgent(nonExistentTicket, did, uid)).toStrictEqual(false);
    expect(await db.removeTicketAgent(tid, 0, nonExistentUser)).toStrictEqual(false);
    expect(await db.removeTicketAgent(tid, 0, uid)).toStrictEqual(false);
    expect(await db.removeTicketAgent(tid, did, nonExistentUser)).toStrictEqual(false);

    const replyId = await db.createReply(tid, uid, 'Valid Reply');
    assert(typeof replyId === 'number');
    expect(replyId).not.toStrictEqual(0);

    expect(await db.getTicketThread(nonExistentTicket)).toHaveLength(0);

    {
        const [first, second, ...rest] = await db.getTicketThread(tid);
        expect(rest).toHaveLength(0);
        expect(first).toMatchObject({
            author_id: uid,
            name: 'Test',
            email: `${email}@example.com`,
            picture: 'http://example.com/avatar.png',
            message_id: mid,
            body: 'yay!',
        });
        expect(second).toMatchObject({
            author_id: uid,
            name: 'Test',
            email: `${email}@example.com`,
            picture: 'http://example.com/avatar.png',
            message_id: replyId,
            body: 'Valid Reply',
        });
    }

    expect(await db.setStatusForTicket(nonExistentTicket, false)).toBeNull();
    expect(await db.setStatusForTicket(tid, false)).toStrictEqual(true);

    {
        const result = await db.createReply(tid, uid, 'This ticket closed, fool!');
        expect(result).toStrictEqual(db.CreateReplyResult.Closed);
    }

    expect(await db.setStatusForTicket(tid, true)).toStrictEqual(false);

    // Assigned to ticket + not department head
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, uid)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, uid)).toStrictEqual(false);
    expect(await db.canAssignOthersToTicket(tid, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, 0, uid)).toStrictEqual(true);
    expect(await db.canAssignOthersToTicket(tid, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, did, uid)).toStrictEqual(true);

    expect(await db.setHeadForAgent(did, uid, true)).toStrictEqual(false);
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(true);

    // Assigned to ticket + department head
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, uid)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, uid)).toStrictEqual(true);
    expect(await db.canAssignOthersToTicket(tid, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, 0, uid)).toStrictEqual(true);
    expect(await db.canAssignOthersToTicket(tid, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, did, uid)).toStrictEqual(true);

    expect(await db.removeTicketAgent(tid, did, uid)).toStrictEqual(true);

    // Not assigned to ticket + department head
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, uid)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, uid)).toStrictEqual(true);
    expect(await db.canAssignOthersToTicket(tid, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, 0, uid)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, did, uid)).toStrictEqual(true);

    expect(await db.setHeadForAgent(did, uid, false)).toStrictEqual(true);
    expect(await db.isHeadSession(session_id, did)).toStrictEqual(false);

    // Not assigned to ticket + not department head
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, 0, uid)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(nonExistentTicket, did, uid)).toStrictEqual(false);
    expect(await db.canAssignOthersToTicket(tid, 0, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, 0, uid)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, did, nonExistentUser)).toBeNull();
    expect(await db.canAssignOthersToTicket(tid, did, uid)).toStrictEqual(false);

    {
        const { uid, email } = await db.begin(async sql => {
            const uid = randomUUID();
            const bytes = getRandomValues(new Uint8Array(21));
            const email = Buffer.from(bytes).toString('base64');
            await sql.upsertUser({
                user_id: uid,
                name: 'Test1',
                email: `${email}@example.com`,
                picture: 'http://example.com/avatar.png',
            });
            return { uid, email };
        });
        const users = await db.getUsersOutsideDept(did);
        expect(users).toContainEqual({
            user_id: uid,
            name: 'Test1',
            email: `${email}@example.com`,
            picture: 'http://example.com/avatar.png',
            admin: false,
        });
    }

    expect(await db.deleteSession(nonExistentSession)).toBeNull();

    {
        const result = await db.deleteSession(session_id);
        assert(result !== null);
        const { user_id, expiration } = result;
        expect(user_id).toStrictEqual(uid);
        expect(expiration.getTime()).toBeGreaterThanOrEqual(Date.now());
    }
});

it('should reject promoting non-existent users', async () => {
    const uid = randomUUID();
    expect(await db.setAdminForUser(uid, true)).toBeNull();
    expect(await db.setAdminForUser(uid, false)).toBeNull();
});

it('should create and update labels', async () => {
    const first = Buffer.from(getRandomValues(new Uint8Array(21))).toString('base64');
    const second = Buffer.from(getRandomValues(new Uint8Array(21))).toString('base64');
    const third = Buffer.from(getRandomValues(new Uint8Array(21))).toString('base64');

    const lid = await db.createLabel(first, 0xc0debabe, null);
    assert(lid !== null && lid !== 0);

    const repeated = await db.createLabel(first, 0xc0debabe, null);
    expect(repeated).toBeNull();

    const other = await db.createLabel(second, 0xc0debabe, 10);
    assert(other !== null && other !== 0);

    expect(await db.editLabelTitle(lid, third)).toStrictEqual(true);
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

describe.concurrent('invalid departments', () => {
    it('should not edit the department name', async ({ expect }) => {
        const result = await db.editDeptName(0, 'Non-existent Support');
        expect(result).toStrictEqual(false);
    });
    it('should return zero rows for getter', async ({ expect }) => {
        const empty = await db.getAgentsByDept(0);
        expect(empty).toHaveLength(0);
    });
});
