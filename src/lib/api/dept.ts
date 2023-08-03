import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { type Dept, DeptSchema } from '$lib/model/dept';
import type { Agent } from '$lib/model/agent';
import { StatusCodes } from 'http-status-codes';

/** Creates a new {@linkcode Dept} and returns the ID. */
export async function create(name: Dept['name']) {
    const res = await fetch('/api/dept', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ name }),
    });
    switch (res.status) {
        case StatusCodes.CREATED:
            return DeptSchema.shape.dept_id.parse(await res.json());
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

/** Edits the `name` field of a {@linkcode Dept}. Returns `false` if not found. */
export async function editName(did: Dept['dept_id'], name: Dept['name']) {
    const { status } = await fetch('/api/dept/name', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id: did.toString(10), name }),
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

export async function addAgent(dept_id: Agent['dept_id'], uid: Agent['user_id'], head: Agent['head']) {
    const { status } = await fetch('/api/dept/agent', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ did: dept_id.toString(10), uid, head: Number(head).toString(10) }),
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

export async function setHead(dept_id: Agent['dept_id'], uid: Agent['user_id'], head: Agent['head']) {
    const { status } = await fetch('/api/user/admin', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ did: dept_id.toString(10), uid, head: Number(head).toString(10) }),
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
