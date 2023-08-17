import type { PageServerLoad } from './$types';
import { getUserFromSession } from '$lib/server/database';

// eslint-disable-next-line func-style
export const load = (async ({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) return { user: null };
    const user = await getUserFromSession(sid);
    return { user };
}) satisfies PageServerLoad;
