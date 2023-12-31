import type { LayoutServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getUserFromSession } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load = (async ({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const user = await getUserFromSession(sid);
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    return user;
}) satisfies LayoutServerLoad;
