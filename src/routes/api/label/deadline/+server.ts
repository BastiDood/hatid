import { editLabelDeadline, getUserFromSession } from '$lib/server/database';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    // We choose form data here because it's more network-efficient than JSON.
    const form = await request.formData();

    const id = form.get('id');
    if (id === null || id instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const lid = parseInt(id, 10);

    const deadline = form.get('deadline');
    if (deadline instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const days = deadline === null ? null : parseInt(deadline, 10);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const user = await getUserFromSession(sid);
    if (user === null) throw error(StatusCodes.UNAUTHORIZED);
    if (!user.admin) throw error(StatusCodes.FORBIDDEN);

    const success = await editLabelDeadline(lid, days);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};