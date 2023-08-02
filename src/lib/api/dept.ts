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
