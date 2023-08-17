import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getAgentsByDept } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load = (async ({ parent, params: { id } }) => {
    const did = parseInt(id, 10);
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const users = await getAgentsByDept(did);
    return { users };
}) satisfies PageServerLoad;
