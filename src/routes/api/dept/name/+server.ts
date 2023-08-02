import { editDeptName, getUserFromSession } from '$lib/server/database';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const id = form.get('id');
    if (id === null || id instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(id, 10);

    const name = form.get('name');
    if (name === null || name instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!user.admin) throw error(StatusCodes.FORBIDDEN);

    const success = await editDeptName(did, name);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};
