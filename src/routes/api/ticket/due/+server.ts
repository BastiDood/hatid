import { editTicketDueDate, isAdminSession } from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const tid = form.get('id');
    if (tid === null || tid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const due = form.get('due');
    if (due === null || due instanceof File || new Date(due.toString()) < new Date())
        throw error(StatusCodes.BAD_REQUEST);
    const date = new Date(due.toString());

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

    const success = await editTicketDueDate(tid, date);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};
