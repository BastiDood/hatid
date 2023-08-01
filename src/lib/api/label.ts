import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { type Label, LabelSchema } from '$lib/model/label';
import { StatusCodes } from 'http-status-codes';

/** Creates a new {@linkcode Label} and returns the ID. */
export async function create(
    title: Label['title'],
    color: Label['color'],
    deadline: Label['deadline'],
) {
    const body = new URLSearchParams({ title, color: color.toString(16) });
    if (deadline !== null) body.set('deadline', deadline.toString(10));
    const res = await fetch('/api/label', {
        method: 'POST',
        credentials: 'same-origin',
        body,
    });
    switch (res.status) {
        case StatusCodes.CREATED:
            return LabelSchema.shape.label_id.parse(await res.json());
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

/** Edits the `title` field of a {@linkcode Label}. Returns `false` if not found. */
export async function editTitle(lid: Label['label_id'], title: Label['title']) {
    const res = await fetch('/api/label/title', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id: lid.toString(10), title }),
    });
    switch (res.status) {
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
            throw new UnexpectedStatusCode(res.status);
    }
}

/** Edits the `color` field of a {@linkcode Label}. Returns `false` if not found. */
export async function editColor(lid: Label['label_id'], color: Label['color']) {
    const res = await fetch('/api/label/color', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id: lid.toString(10), color: color.toString(16) }),
    });
    switch (res.status) {
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
            throw new UnexpectedStatusCode(res.status);
    }
}

/** Edits the `deadline` field of a {@linkcode Label}. Returns `false` if not found. */
export async function editDeadline(lid: Label['label_id'], deadline: Label['deadline']) {
    const body = new URLSearchParams({ id: lid.toString(10) });
    if (deadline !== null) body.set('deadline', deadline.toString(10));
    const res = await fetch('/api/label/deadline', {
        method: 'PATCH',
        credentials: 'same-origin',
        body,
    });
    switch (res.status) {
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
            throw new UnexpectedStatusCode(res.status);
    }
}
