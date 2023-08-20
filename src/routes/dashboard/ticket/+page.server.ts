import type { Actions, PageServerLoad } from './$types';
import {
    CreateTicketResult,
    createTicket,
    getLabelsWithoutDeadline,
    getUserFromSession,
} from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const load = (async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const labels = await getLabelsWithoutDeadline();
    return { labels };
}) satisfies PageServerLoad;

export const actions = {
    async default({ cookies, request }) {
        const form = await request.formData();

        const title = form.get('title');
        if (title === null || title instanceof File) return fail(StatusCodes.BAD_REQUEST);

        const body = form.get('body');
        if (body === null || body instanceof File) return fail(StatusCodes.BAD_REQUEST);

        const labels = form.getAll('label').map(entry => {
            // FIXME: Somehow refactor to use `return fail` instead of `throw error`.
            if (entry === null || entry instanceof File) throw error(StatusCodes.BAD_REQUEST);
            return parseInt(entry, 10) >> 0;
        });

        const sid = cookies.get('sid');
        if (!sid) throw error(StatusCodes.UNAUTHORIZED);

        const user = await getUserFromSession(sid);
        if (user === null) throw error(StatusCodes.UNAUTHORIZED);

        const result = await createTicket(title, user.user_id, body, labels);
        if (typeof result === 'object') {
            // TODO: Somehow log the `due` date.
            const { tid, mid } = result;
            const hash = mid.getTime();
            throw redirect(StatusCodes.MOVED_TEMPORARILY, `/dashboard/ticket/${tid}#${hash}`);
        }

        switch (result) {
            case CreateTicketResult.NoAuthor:
            case CreateTicketResult.NoLabels:
                throw error(StatusCodes.NOT_FOUND);
            default:
                throw new AssertionError();
        }
    },
} satisfies Actions;
