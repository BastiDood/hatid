import type { RequestHandler } from '../$types';
import { StatusCodes } from 'http-status-codes';
import { editTicketTitle } from '$lib/server/database';
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

    // TODO: Missing a permission check. Editing should only be allowed for the ticket author and agents assigned to the ticket.

    const success = await editTicketTitle(tid, title);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};
