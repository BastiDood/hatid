import {
    AssignAgentToTicketResult,
    assignAgentToTicket,
    canAssignOthersToTicket,
    getUserFromSession,
    isAssignableAgent,
    isAssignedDepartment,
    removeTicketAgent,
} from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

function resultToCode(result: AssignAgentToTicketResult) {
    switch (result) {
        case AssignAgentToTicketResult.Success:
            return StatusCodes.CREATED;
        case AssignAgentToTicketResult.NoTicket:
        case AssignAgentToTicketResult.NoAgent:
            return StatusCodes.NOT_FOUND;
        default:
            throw new AssertionError();
    }
}

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('ticket');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const dept = form.get('dept');
    if (dept === null || dept instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(dept, 10) >> 0;

    const uid = form.get('user');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const deptStatus = await isAssignedDepartment(tid, did);
    if (!deptStatus) throw error(StatusCodes.FORBIDDEN);

    // Check if allowed to assign and guard against self-assignment
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);

    // Assert that the target is not "self"
    if (user.user_id === uid) throw error(StatusCodes.FORBIDDEN);

    // Check if action-doer can assign others
    switch (await canAssignOthersToTicket(tid, did, user.user_id)) {
        case null:
            throw error(StatusCodes.NOT_FOUND);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    // Check if the target can be assigned to the ticket
    switch (await isAssignableAgent(tid, did, uid)) {
        case null:
            throw error(StatusCodes.NOT_FOUND);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    const status = resultToCode(await assignAgentToTicket(tid, did, uid));
    return new Response(null, { status });
};

// eslint-disable-next-line func-style
export const DELETE: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('ticket');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const dept = form.get('dept');
    if (dept === null || dept instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(dept, 10);

    const uid = form.get('user');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const deptStatus = await isAssignedDepartment(tid, did);
    if (!deptStatus) throw error(StatusCodes.FORBIDDEN);

    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);

    // Check if allowed to remove (same permission needed as assigning others)
    switch (await canAssignOthersToTicket(tid, did, user.user_id)) {
        case null:
            throw error(StatusCodes.UNAUTHORIZED);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    const success = await removeTicketAgent(tid, did, uid);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};
