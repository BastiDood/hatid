import {
    AddDeptAgentResult,
    addDeptAgent,
    isHeadSession,
    removeDeptAgent,
} from '$lib/server/database';
import { AssertionError } from 'node:assert/strict';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { error } from '@sveltejs/kit';

function resultToCode(result: AddDeptAgentResult) {
    switch (result) {
        case AddDeptAgentResult.Success:
            return StatusCodes.CREATED;
        case AddDeptAgentResult.AlreadyExists:
            return StatusCodes.CONFLICT;
        case AddDeptAgentResult.NoDept:
        case AddDeptAgentResult.NoUser:
            return StatusCodes.NOT_FOUND;
        default:
            throw new AssertionError();
    }
}

// eslint-disable-next-line func-style
export const POST: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const rawDid = form.get('did');
    if (rawDid === null || rawDid instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(rawDid, 10);

    const uid = form.get('uid');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

    const sid = cookies.get('sid');
    if (!sid) throw error(StatusCodes.UNAUTHORIZED);

    // TODO: session has expired so we must inform the client that they should log in again
    // IMPORTANT: Only Dept. Heads can add Agents, must set add initial dept. head
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

    const status = resultToCode(await addDeptAgent(did, uid));
    return new Response(null, { status });
};

// eslint-disable-next-line func-style
export const DELETE: RequestHandler = async ({ cookies, request }) => {
    const form = await request.formData();

    const rawDid = form.get('did');
    if (rawDid === null || rawDid instanceof File) throw error(StatusCodes.BAD_REQUEST);
    const did = parseInt(rawDid, 10);

    const uid = form.get('uid');
    if (uid === null || uid instanceof File) throw error(StatusCodes.BAD_REQUEST);

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

    const success = await removeDeptAgent(did, uid);
    const status = success ? StatusCodes.NO_CONTENT : StatusCodes.NOT_FOUND;
    return new Response(null, { status });
};
