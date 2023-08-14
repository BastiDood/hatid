import {
    AssignAgentToTicketResult,
    assignAgentToTicket,
    canAssignOthersToTicket,
    canAssignSelfToTicket,
    getUserFromSession,
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

    // Permissions check
    // Department assignment check
    // TODO: Null check for isAssignedAgent and isAssignedDepartment
    const deptStatus = await isAssignedDepartment(tid, did);
    if (!deptStatus) throw error(StatusCodes.FORBIDDEN);

    // Check if allowed to assign and guard against self-assignment
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    const canAssign = await canAssignOthersToTicket(sid, did, tid, user.user_id);
    if (canAssign === null) throw error(StatusCodes.UNAUTHORIZED);

    switch (canAssign && !(user.user_id === uid)) {
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    // Assignable agent check - TODO: Probably should rename to isAssignableAgent check
    switch (await canAssignSelfToTicket(tid, did, uid)) {
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

    const tid = form.get('tid');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const dept = form.get('dept');
    if (dept === null || dept instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(dept, 10);

    const uid = form.get('uid');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // Permissions check
    // Department assignment check
    // TODO: Null check for isAssignedAgent and isAssignedDepartment
    const deptStatus = await isAssignedDepartment(tid, did);
    if (!deptStatus) throw error(StatusCodes.FORBIDDEN);

    // Check if allowed to remove (same permission needed as assigning others)
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    const canAssign = await canAssignOthersToTicket(sid, did, tid, user.user_id);

    switch (canAssign) {
        case null:
            throw error(StatusCodes.UNAUTHORIZED);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    const value = await removeTicketAgent(tid, did, uid);
    const status = value ? StatusCodes.RESET_CONTENT : StatusCodes.NO_CONTENT;
    return new Response(null, { status });
};
