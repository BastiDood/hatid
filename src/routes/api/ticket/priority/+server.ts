import {
    AssignTicketPriorityResult,
    assignTicketPriority,
    getUserFromSession,
    isAssignedAgent,
} from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from '../$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

function resultToCode(result: AssignTicketPriorityResult) {
    switch (result) {
        case AssignTicketPriorityResult.Success:
            return StatusCodes.NO_CONTENT;
        case AssignTicketPriorityResult.TicketNotFound:
        case AssignTicketPriorityResult.InvalidPriority:
            return StatusCodes.NOT_FOUND;
        default:
            throw new AssertionError();
    }
}

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('id');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const priority = form.get('priority');
    if (priority === null || priority instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const pid = parseInt(priority, 10);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!(await isAssignedAgent(tid, user.user_id))) throw error(StatusCodes.FORBIDDEN);

    const status = resultToCode(await assignTicketPriority(tid, pid));
    return new Response(null, { status });
};
