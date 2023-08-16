import type { Label } from '$lib/model/label';
import type { PageServerLoad } from './$types';
import { StatusCodes } from 'http-status-codes';
import { getLabels } from '$lib/server/database';
import { redirect } from '@sveltejs/kit';

interface Output {
    labels: Label[];
}

// eslint-disable-next-line func-style
export const load: PageServerLoad<Output> = async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const labels = await getLabels();
    return { labels };
};
