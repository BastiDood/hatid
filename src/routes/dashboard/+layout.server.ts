import type { LayoutServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import type { User } from '$lib/server/model/user';
import { getUserFromSession } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load: LayoutServerLoad<User> = async ({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const user = await getUserFromSession(sid);
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    return user;
};
