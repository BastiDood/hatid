import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import type { Agent } from '$lib/model/agent';
import type { Dept } from '$lib/model/dept';
import { StatusCodes } from 'http-status-codes';
import type { User } from '$lib/model/user';

/**
 * Adds a new {@linkcode User} to a {@linkcode Dept}. Returns `true` if successful, `false` if the
 * {@linkcode Agent} already exists, and `null` if either the department or the user is not found.
 */
export async function add(dept_id: Dept['dept_id'], uid: User['user_id'], head: Agent['head']) {
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
        case StatusCodes.CREATED:
            return true;
        case StatusCodes.CONFLICT:
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

/** Promotes a {@linkcode User} as the head of the {@linkcode Dept}. */
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
