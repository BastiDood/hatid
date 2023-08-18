import type { Actions, PageServerLoad } from './$types';
import { createDept, getUserInbox, getOpenTickets, isAdminSession } from '$lib/server/database';
import { error, fail, redirect } from '@sveltejs/kit';
import { AssertionError } from 'node:assert/strict';
import { StatusCodes } from 'http-status-codes';

// eslint-disable-next-line func-style
export const load = (async ({ cookies, parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const sid = cookies.get('sid');
    console.log(sid);
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);
    const tickets = await getUserInbox(sid);
    return { tickets };
}) satisfies PageServerLoad;