import {
    AssignTicketLabelResult,
    assignTicketLabel,
    getUserFromSession,
    isAssignedAgent,
} from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

function resultToCode(result: AssignTicketLabelResult) {
    switch (result) {
        case AssignTicketLabelResult.Success:
            return StatusCodes.CREATED;
        case AssignTicketLabelResult.AlreadyExists:
            return StatusCodes.CONFLICT;
        case AssignTicketLabelResult.NoTicket:
        case AssignTicketLabelResult.NoLabel:
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

    const label = form.get('label');
    if (label === null || label instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const lid = parseInt(label, 10) >> 0;

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);

    const result = await isAssignedAgent(tid, user.user_id);
    // TODO: add warning to the console if null
    if (!result) throw error(StatusCodes.FORBIDDEN);

    const status = resultToCode(await assignTicketLabel(tid, lid));
    return new Response(null, { status });
};
