import type { PageServerLoad } from './$types';
import { getUserFromSession } from '$lib/server/database';

type MaybeUser = Awaited<ReturnType<typeof getUserFromSession>>;

interface Output {
    user: MaybeUser;
}

// eslint-disable-next-line func-style
export const load: PageServerLoad<Output> = async ({ cookies }) => {
    const sid = cookies.get('sid');
    if (!sid) return { user: null };
    const user = await getUserFromSession(sid);
    return { user };
};
