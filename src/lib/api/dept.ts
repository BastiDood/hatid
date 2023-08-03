import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { type Dept, DeptSchema } from '$lib/model/dept';
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
