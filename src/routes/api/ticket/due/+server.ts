import { editTicketDueDate, getUserFromSession, isAssignedAgent } from '$lib/server/database';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('id');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const due = form.get('due');
    if (due === null || due instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const date = new Date(due);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const head = await getUserFromSession(sid);
    if (head === null) throw error(StatusCodes.UNAUTHORIZED);

    const result = await isAssignedAgent(tid, head.user_id);
    if (result === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!result) throw error(StatusCodes.FORBIDDEN);

    const success = await editTicketDueDate(tid, date);
    if (success === null) throw error(StatusCodes.NOT_FOUND);

    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.PRECONDITION_FAILED;
    return new Response(null, { status });
};
