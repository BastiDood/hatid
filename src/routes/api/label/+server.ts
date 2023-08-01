import { createLabel, getUserFromSession } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    // We choose form data here because it's more network-efficient than JSON.
    const form = await request.formData();

    const title = form.get('title');
    if (title === null || title instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const color = form.get('color');
    if (color === null || color instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const hex = parseInt(color, 16);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!user.admin) throw error(StatusCodes.FORBIDDEN);

    const id = await createLabel(title, hex);
    return json(id, { status: StatusCodes.CREATED });
};
