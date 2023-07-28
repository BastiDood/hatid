import type { LayoutServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getUserFromSession } from '$lib/database';
import { redirect } from '@sveltejs/kit';

export const load = (({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    return getUserFromSession(sid);
}) satisfies LayoutServerLoad;
