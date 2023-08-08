import { CreateReplyResult, createReply, getUserFromSession } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('ticket');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const body = form.get('body');
    if (body === null || body instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);

    const result = await createReply(tid, user.user_id, body);
    if (result === null) return new Response(null, { status: StatusCodes.GONE });
    if (typeof result === 'number') return json(result, { status: StatusCodes.CREATED });

    switch (result) {
        case CreateReplyResult.NoUser:
        case CreateReplyResult.NoTicket:
            return new Response(null, { status: StatusCodes.NOT_FOUND });
        default:
            throw new AssertionError();
    }
};
