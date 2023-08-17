import { CreateTicketResult, createTicket, getUserFromSession } from '$lib/server/database';
import { error, json } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AssertionError } from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';

export const actions = {
    default: async ({ cookies, request }) => {
        const form = await request.formData();

        const title = form.get('title');
        if (title === null || title instanceof File) throw error(StatusCodes.BAD_REQUEST);

        const body = form.get('body');
        if (body === null || body instanceof File) throw error(StatusCodes.BAD_REQUEST);

        const labels = form.getAll('label').map(entry => {
            if (entry === null || entry instanceof File) throw error(StatusCodes.BAD_REQUEST);
            return parseInt(entry, 10) >> 0;
        });

        const sid = cookies.get('sid');
        if (!sid) throw error(StatusCodes.UNAUTHORIZED);

        const user = await getUserFromSession(sid);
        if (user === null) throw error(StatusCodes.UNAUTHORIZED);

        const result = await createTicket(title, user.user_id, body, labels);
        if (typeof result === 'object') return json(result, { status: StatusCodes.CREATED });

        switch (result) {
            case CreateTicketResult.NoAuthor:
            case CreateTicketResult.NoLabels:
                throw error(StatusCodes.NOT_FOUND);
            default:
                throw new AssertionError();
        }
    },
} satisfies Actions;
