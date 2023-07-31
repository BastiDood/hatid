import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { type Label, LabelSchema } from '$lib/model/label';
import { StatusCodes } from 'http-status-codes';

/** Creates a new {@linkcode Label} and returns the ID. */
export async function create(title: Label['title'], color: Label['color']) {
    const hex = color.toString(16);
    const res = await fetch('/api/label', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ title, color: hex }),
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
