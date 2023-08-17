import type { Actions, PageServerLoad } from './$types';
import { createPriority, getPriorities, isAdminSession } from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const load = (async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const priorities = await getPriorities();
    return { priorities };
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ cookies, request }) => {
        const form = await request.formData();

        const title = form.get('title');
        if (title === null || title instanceof File) return fail(StatusCodes.BAD_REQUEST);

        const prio = form.get('priority');
        if (prio === null || prio instanceof File) return fail(StatusCodes.BAD_REQUEST);
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
        return { id };
    },
} satisfies Actions;
