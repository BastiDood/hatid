import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getUserInbox } from '$lib/server/database';

// eslint-disable-next-line func-style
export const load = (async ({ cookies, parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);
    const tickets = await getUserInbox(sid);
    return { tickets };
}) satisfies PageServerLoad;
