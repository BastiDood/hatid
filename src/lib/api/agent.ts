import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import type { Agent } from '$lib/model/agent';
import { StatusCodes } from 'http-status-codes';

export async function add(dept_id: Agent['dept_id'], uid: Agent['user_id'], head: Agent['head']) {
    const { status } = await fetch('/api/agent', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({
            did: dept_id.toString(10),
            uid,
            head: Number(head).toString(10),
        }),
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.RESET_CONTENT:
            return false;
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        case StatusCodes.FORBIDDEN:
            throw new InsufficientPermissions();
        default:
            throw new UnexpectedStatusCode(status);
    }
}

export async function setHead(
    dept_id: Agent['dept_id'],
    uid: Agent['user_id'],
    head: Agent['head'],
) {
    const { status } = await fetch('/api/agent/head', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({
            did: dept_id.toString(10),
            uid,
            head: Number(head).toString(10),
        }),
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.RESET_CONTENT:
            return false;
        case StatusCodes.NOT_FOUND:
            return null;
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        case StatusCodes.FORBIDDEN:
            throw new InsufficientPermissions();
        default:
            throw new UnexpectedStatusCode(status);
    }
}
