import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { type Dept, type DeptLabel, DeptSchema } from '$lib/model/dept';
import { LabelSchema } from '$lib/model/label';
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

/** Gets a list of all the {@linkcode Dept} in the system. */
export async function getAll() {
    const res = await fetch('/api/dept', { credentials: 'same-origin' });
    switch (res.status) {
        case StatusCodes.OK:
            return DeptSchema.array().parse(await res.json());
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        default:
            throw new UnexpectedStatusCode(res.status);
    }
}

/** Gets a list of all the {@linkcode Dept} in the system. */
export async function getLabels(did: DeptLabel['dept_id']) {
    const res = await fetch(`/api/dept/label?dept=${did}`, { credentials: 'same-origin' });
    switch (res.status) {
        case StatusCodes.OK:
            return LabelSchema.pick({ label_id: true, title: true, color: true })
                .array()
                .parse(await res.json());
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
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
