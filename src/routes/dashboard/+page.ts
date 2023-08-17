import type { PageLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const load = (() => {
    throw redirect(StatusCodes.MOVED_TEMPORARILY, '/dashboard/inbox');
}) satisfies PageLoad;
