import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { deleteSession } from '$lib/server/database';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const DELETE: RequestHandler = async ({ cookies }) => {
    const sid = cookies.get('sid');
    cookies.delete('sid', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
    });

    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    const result = await deleteSession(sid);
    if (result === null) throw error(StatusCodes.UNAUTHORIZED);
    // TODO: log the deleted session to the console
    return new Response(null, { status: StatusCodes.NO_CONTENT });
};
