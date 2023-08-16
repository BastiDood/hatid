import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load: PageServerLoad = () => {
    throw redirect(StatusCodes.MOVED_TEMPORARILY, '/dashboard/inbox');
};
