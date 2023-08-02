import { getUserFromSession, setAdminForUser } from '$lib/server/database';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    // We choose form data here because it's more network-efficient than JSON.
    const form = await request.formData();

    const uid = form.get('id');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const rawAdmin = form.get('admin');
    if (rawAdmin === null || rawAdmin instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const admin = Boolean(parseInt(rawAdmin, 10));

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!user.admin) throw error(StatusCodes.FORBIDDEN);

    const prev = await setAdminForUser(uid, admin);
    if (prev === null) return new Response(null, { status: StatusCodes.NOT_FOUND });

    // Return `205 Reset Content` if no change occurred because the caller must have expected
    // to modify the administrator permissions. If we end up at the same place, then there
    // must have been some data conflict between the client and the server. The page must be reset.
    const status = prev === admin ? StatusCodes.RESET_CONTENT : StatusCodes.NO_CONTENT;
    return new Response(null, { status });
};
