import { canEditTicketTitle, getUserFromSession, setStatusForTicket } from '$lib/server/database';
import type { RequestHandler } from '../$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('id');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const rawOpen = form.get('open');
    if (rawOpen === null || rawOpen instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const open = Boolean(parseInt(rawOpen, 10));

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    // Permissions are the same as canEditTicketTitle: ticket author and assigned agents
    if (!(await canEditTicketTitle(tid, user.user_id))) throw error(StatusCodes.FORBIDDEN);

    const prev = await setStatusForTicket(tid, open);
    if (prev === null) return new Response(null, { status: StatusCodes.NOT_FOUND });

    const status = prev ? StatusCodes.NO_CONTENT : StatusCodes.RESET_CONTENT;
    return new Response(null, { status });
};
