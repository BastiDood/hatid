import {
    BadInput,
    EntityNotFound,
    InsufficientPermissions,
    InvalidSession,
    UnexpectedStatusCode,
} from './error';
import {
    CreateTicketSchema,
    type Message,
    MessageSchema,
    type Ticket,
    type TicketLabel,
} from '$lib/model/ticket';
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
 * Assigns the `priority_id` field of a {@linkcode Ticket} to set ticket priority.
 * Returns `true` if successful. Otherwise, it is `false`.
 */
export async function assignPriority(tid: Ticket['ticket_id'], pid: Ticket['priority_id']) {
    const { status } = await fetch('/api/ticket/priority', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({
            ticket: tid,
            priority: pid.toString(10),
        }),
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

/**
 * Assigns a {@linkcode Label} to a {@linkcode Ticket}. Returns `true` if successful. If the label
 * has previously been assigned to the same ticket, it returns `false`. Otherwise, if the ticket
 * or the label do not exist, it returns `null`.
 */
export async function assignLabel(ticket: TicketLabel['ticket_id'], lid: TicketLabel['label_id']) {
    const { status } = await fetch('/api/ticket/label', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ ticket, label: lid.toString(10) }),
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

/**
 * Changes the status of a {@linkcode Ticket}. Returns the previous value of `open`
 * or `null` if the ticket does not exist.
 */
export async function setStatus(tid: Ticket['ticket_id'], open: Ticket['open']) {
    const { status } = await fetch('/api/agent/head', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({
            tid,
            open: Number(open).toString(10),
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
