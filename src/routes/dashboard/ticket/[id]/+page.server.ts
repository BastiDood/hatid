import type { Actions, PageServerLoad } from './$types';
import {
    CreateReplyResult,
    createReply,
    getAssignedAgentsToTicket,
    getTicketInfo,
    getTicketThread,
    getUserFromSession,
    resolveTicketLabels,
} from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const load = (async ({ parent, params: { id } }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    return {
        uid: user.user_id,
        agents: getAssignedAgentsToTicket(id),
        labels: resolveTicketLabels(id),
        info: getTicketInfo(id),
        messages: getTicketThread(id),
    };
}) satisfies PageServerLoad;

function resultToCode(result: CreateReplyResult) {
    switch (result) {
        case CreateReplyResult.Closed:
            return StatusCodes.GONE;
        case CreateReplyResult.NoTicket:
        case CreateReplyResult.NoUser:
            return StatusCodes.NOT_FOUND;
        default:
            throw new AssertionError();
    }
}

export const actions = {
    async default({ cookies, request, params: { id } }) {
        const form = await request.formData();
        const body = form.get('body');
        if (body === null || body instanceof File) return fail(StatusCodes.BAD_REQUEST);

        const sid = cookies.get('sid');
        if (!sid) throw error(StatusCodes.UNAUTHORIZED);

        const user = await getUserFromSession(sid);
        if (user === null) throw error(StatusCodes.UNAUTHORIZED);

        const creation = await createReply(id, user.user_id, body);
        if (creation instanceof Date) return { mid: creation.getTime() };

        const status = resultToCode(creation);
        throw error(status);
    },
} satisfies Actions;
