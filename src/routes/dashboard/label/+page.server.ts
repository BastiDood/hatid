import { createLabel, getLabels, isAdminSession } from '$lib/server/database';
import { error, json, redirect } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import type { Label } from '$lib/model/label';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';

interface Output {
    labels: Label[];
}

// eslint-disable-next-line func-style
export const load: PageServerLoad<Output> = async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const labels = await getLabels();
    return { labels };
};

export const actions = {
    default: async ({ cookies, request }) => {
        const form = await request.formData();

        const title = form.get('title');
        if (title === null || title instanceof File) throw error(StatusCodes.BAD_REQUEST);

        const color = form.get('color');
        if (color === null || color instanceof File) throw error(StatusCodes.BAD_REQUEST);
        const hex = parseInt(color, 16);

        const deadline = form.get('deadline');
        if (deadline instanceof File) throw error(StatusCodes.BAD_REQUEST);
        const days = deadline === null ? null : parseInt(deadline, 10);

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
        return json(id, { status: StatusCodes.CREATED });
    },
};
