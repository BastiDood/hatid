import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getUsersAndAdmins } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load = (async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const { users, admins } = await getUsersAndAdmins();
    return { uid: user.user_id, users, admins };
}) satisfies PageServerLoad;
