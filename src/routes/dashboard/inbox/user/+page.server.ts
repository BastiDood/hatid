import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getUserInbox } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const tickets = await getUserInbox(user.user_id);
    return { tickets };
}) satisfies PageServerLoad;
