import {
    createDept,
    getDepartments,
    getUserFromSession,
    isAdminSession,
} from '$lib/server/database';
import { error, json } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const GET: RequestHandler = async ({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    return json(await getDepartments());
};

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const name = form.get('name');
    if (name === null || name instanceof File) throw error(StatusCodes.BAD_REQUEST);

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

    const id = await createDept(name);
    return json(id, { status: StatusCodes.CREATED });
};
