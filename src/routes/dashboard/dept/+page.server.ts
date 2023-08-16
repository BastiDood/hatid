import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Dept } from '$lib/model/dept';
import { StatusCodes } from 'http-status-codes';
import { getDepartments } from '$lib/server/database';

interface Output {
    depts: Dept[];
}

// eslint-disable-next-line func-style
export const load: PageServerLoad<Output> = async ({ parent }) => {
    const user = await parent();
    if (user === null) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/auth/login');
    const depts = await getDepartments();
    return { depts };
};
