import type { PageServerLoad } from './$types';
import type { Priority } from '$lib/model/priority';
import { StatusCodes } from 'http-status-codes';
import { getPriorities } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

interface Output {
    priorities: Priority[];
}

// eslint-disable-next-line func-style
export const load: PageServerLoad<Output> = async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const priorities = await getPriorities();
    return { priorities };
};
