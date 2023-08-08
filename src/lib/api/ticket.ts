import {
    BadInput,
    EntityNotFound,
    InsufficientPermissions,
    InvalidSession,
    UnexpectedStatusCode,
} from './error';
import { CreateTicketSchema, type Message, MessageSchema, type Ticket } from '$lib/model/ticket';
import type { Label } from '$lib/model/label';
import { StatusCodes } from 'http-status-codes';

/**
 * Creates a new {@linkcode Ticket} and returns its `ticket_id` as `tid` and its the `message_id`
 * as `mid`. The `mid` points to the first {@linkcode Message} in the ticket's conversation thread.
 */
export async function create(
    title: Ticket['title'],
    content: Message['body'],
    labels: Label['label_id'][],
) {
    const body = new URLSearchParams({ title, body: content });
    for (const label of labels) {
        const int = label >> 0;
        const data = int.toString(10);
        body.append('label', data);
    }

    const res = await fetch('/api/ticket', {
        method: 'POST',
        credentials: 'same-origin',
        body,
    });

    switch (res.status) {
        case StatusCodes.CREATED:
            return CreateTicketSchema.parse(await res.json());
        case StatusCodes.NOT_FOUND:
            return null;
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        default:
            throw new UnexpectedStatusCode(res.status);
    }
}

/** Edits the `title` field of a {@linkcode Ticket}. Returns `false` if not found. */
export async function editTitle(id: Ticket['ticket_id'], title: Ticket['title']) {
    const { status } = await fetch('/api/ticket/title', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id, title }),
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
 * Edits the `due_date` field of a {@linkcode Ticket}. Returns `true` if successful.
 * Returns `false` is the date is invalid. Otherwise, `null` if the ticket is not found.
 */
export async function editDueDate(id: Ticket['ticket_id'], due: Ticket['due_date']) {
    const { status } = await fetch('/api/ticket/due', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id, due: due.toISOString() }),
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.PRECONDITION_FAILED:
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

/** Creates a new reply {@linkcode Message} to a {@linkcode Ticket} and returns its `message_id`. */
export async function reply(ticket: Message['ticket_id'], body: Message['body']) {
    const res = await fetch('/api/ticket/reply', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ ticket, body }),
    });
    switch (res.status) {
        case StatusCodes.CREATED:
            return MessageSchema.shape.message_id.parse(await res.json());
        case StatusCodes.GONE:
            return null;
        case StatusCodes.NOT_FOUND:
            throw new EntityNotFound();
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        default:
            throw new UnexpectedStatusCode(res.status);
    }
}
