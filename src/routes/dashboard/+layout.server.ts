import type { LayoutServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import type { User } from '$lib/model/user';
import { getUserFromSession } from '$lib/database';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad<User> = async ({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');

    const user = await getUserFromSession(sid);
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');

    return user;
};
