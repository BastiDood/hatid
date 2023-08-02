import { createPriority, isAdminSession } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    // We choose form data here because it's more network-efficient than JSON.
    const form = await request.formData();

    const title = form.get('title');
    if (title === null || title instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const prio = form.get('priority');
    if (prio === null || prio instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const priority = parseInt(prio, 10);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const admin = await isAdminSession(sid);
    switch (admin) {
        case null:
            throw error(StatusCodes.UNAUTHORIZED);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    const id = await createPriority(title, priority);
    return json(id, { status: StatusCodes.CREATED });
};
