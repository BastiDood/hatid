import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { type Priority, PrioritySchema } from '$lib/model/priority';
import { StatusCodes } from 'http-status-codes';

/** Creates a new {@linkcode Label} and returns the ID. */
export async function create(title: Priority['title'], priority: Priority['priority']) {
    const body = new URLSearchParams({ title, priority: priority.toString(10) });
    const res = await fetch('/api/priority', {
        method: 'POST',
        credentials: 'same-origin',
        body,
    });
    switch (res.status) {
        case StatusCodes.CREATED:
            return PrioritySchema.shape.priority_id.parse(await res.json());
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        case StatusCodes.FORBIDDEN:
            throw new InsufficientPermissions();
        default:
            throw new UnexpectedStatusCode(res.status);
    }
}

/** Edits the `title` field of a {@linkcode Priority}. Returns `false` if not found. */
export async function editTitle(pid: Priority['priority_id'], title: Priority['title']) {
    const { status } = await fetch('/api/priority/title', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id: pid.toString(10), title }),
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.NOT_FOUND:
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

/** Edits the `priority` field of a {@linkcode Priority}. Returns `false` if not found. */
export async function editLevel(pid: Priority['priority_id'], priority: Priority['priority']) {
    const { status } = await fetch('/api/priority/level', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id: pid.toString(10), priority: priority.toString(10) }),
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.NOT_FOUND:
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
