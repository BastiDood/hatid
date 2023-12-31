import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import type { Dept, DeptLabel } from '$lib/model/dept';
import { StatusCodes } from 'http-status-codes';

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

/**
 * Subscribes a {@linkcode Dept} to a {@linkcode Label}. If any of `did` and `lid` do not exist,
 * this function returns `null`. Returns `true` if successfully created and `false` otherwise if
 * the `did`-`lid` pair already exists in the database (in which case nothing is done).
 */
export async function subscribeToLabel(did: DeptLabel['dept_id'], lid: DeptLabel['label_id']) {
    const { status } = await fetch('/api/dept/label', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ dept: did.toString(10), label: lid.toString(10) }),
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
