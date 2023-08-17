import type { Actions, PageServerLoad } from './$types';
import { createLabel, getLabels, isAdminSession } from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const load = (async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const labels = await getLabels();
    return { labels };
}) satisfies PageServerLoad;

export const actions = {
    async default({ cookies, request }) {
        const form = await request.formData();

        const title = form.get('title');
        if (title === null || title instanceof File) return fail(StatusCodes.BAD_REQUEST);

        const color = form.get('color');
        if (color === null || color instanceof File) return fail(StatusCodes.BAD_REQUEST);
        const hex = (parseInt(color.slice(1), 16) << 8) | 0xff;

        const deadline = form.get('deadline');
        if (deadline === null || deadline instanceof File) return fail(StatusCodes.BAD_REQUEST);

        // FIXME: Consider the `NaN` case as a security measure.
        const days = deadline.length === 0 ? null : parseInt(deadline, 10);

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

        const id = await createLabel(title, hex, days);
        return { id };
    },
} satisfies Actions;
