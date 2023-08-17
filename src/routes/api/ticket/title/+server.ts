import { canEditTicket, editTicketTitle, getUserFromSession } from '$lib/server/database';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('id');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const title = form.get('title');
    if (title === null || title instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!(await canEditTicket(tid, user.user_id))) throw error(StatusCodes.FORBIDDEN);

    const success = await editTicketTitle(tid, title);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};
