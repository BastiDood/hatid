import { isHeadSession, setHeadForAgent } from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const PATCH: RequestHandler = async ({ cookies, request }) => {
    // We choose form data here because it's more network-efficient than JSON.
    const form = await request.formData();

    const rawDid = form.get('did');
    if (rawDid === null || rawDid instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(rawDid, 10);

    const uid = form.get('uid');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const rawHead = form.get('head');
    if (rawHead === null || rawHead instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const newHead = Boolean(parseInt(rawHead, 10));

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    const head = await isHeadSession(sid, did);
    switch (head) {
        case null:
            throw error(StatusCodes.UNAUTHORIZED);
        case false:
            throw error(StatusCodes.FORBIDDEN);
        case true:
            break;
        default:
            throw new AssertionError();
    }

    // FIXME: disallow self-downgrade of permission
    const prev = await setHeadForAgent(did, uid, newHead);
    if (prev === null) return new Response(null, { status: StatusCodes.NOT_FOUND });

    const status = prev === head ? StatusCodes.RESET_CONTENT : StatusCodes.NO_CONTENT;
    return new Response(null, { status });
};
