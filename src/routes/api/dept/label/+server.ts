import {
    SubscribeDeptToLabelResult,
    isHeadSession,
    subscribeDeptToLabel,
} from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

function resultToCode(result: SubscribeDeptToLabelResult) {
    switch (result) {
        case SubscribeDeptToLabelResult.Success:
            return StatusCodes.CREATED;
        case SubscribeDeptToLabelResult.Exists:
            return StatusCodes.CONFLICT;
        case SubscribeDeptToLabelResult.NoLabel:
        case SubscribeDeptToLabelResult.NoDept:
            return StatusCodes.NOT_FOUND;
        default:
            throw new AssertionError();
    }
}

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const dept = form.get('dept');
    if (dept === null || dept instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(dept, 10);

    const label = form.get('label');
    if (label === null || label instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const lid = parseInt(dept, 10);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const admin = await isHeadSession(sid, did);
    switch (admin) {
        case null:
            throw error(StatusCodes.UNAUTHORIZED);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    const status = resultToCode(await subscribeDeptToLabel(did, lid));
    return new Response(null, { status });
};
