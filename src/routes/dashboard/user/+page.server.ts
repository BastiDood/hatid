import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getUsers } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load = (async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const users = await getUsers();
    return { users };
}) satisfies PageServerLoad;
