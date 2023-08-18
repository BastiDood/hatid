import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import type { Ticket, TicketLabel } from '$lib/model/ticket';
import type { Agent } from '$lib/model/agent';
import { StatusCodes } from 'http-status-codes';

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
export async function setStatus(id: Ticket['ticket_id'], open: Ticket['open']) {
    const { status } = await fetch('/api/ticket/status', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({
            id,
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

/**
 * Assigns self (on behalf of `dept`) to the `ticket`. If the ticket or the user cannot be found,
 * this function returns `false`. Otherwise, it returns `true` on successful assignments.
 */
export async function assignSelf(ticket: Ticket['ticket_id'], dept: Agent['dept_id']) {
    const { status } = await fetch('/api/ticket/claim', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ ticket, dept: dept.toString(10) }),
    });
    switch (status) {
        case StatusCodes.CREATED:
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
 * Assigns another {@linkcode Agent} to the {@linkcode Ticket}. If the ticket or the user cannot
 * be found, this function returns `false`. Otherwise, it returns `true` on successful assignments.
 */
export async function assignOthers(
    ticket: Ticket['ticket_id'],
    dept: Agent['dept_id'],
    user: Agent['user_id'],
) {
    const { status } = await fetch('/api/ticket/assign', {
        method: 'POST',
        credentials: 'same-origin',
        body: new URLSearchParams({ ticket, dept: dept.toString(10), user }),
    });
    switch (status) {
        case StatusCodes.CREATED:
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

/** Removes an {@linkcode Agent} from the {@linkcode Ticket}. Returns `true` if successful. */
export async function remove(
    ticket: Ticket['ticket_id'],
    dept: Agent['dept_id'],
    user: Agent['user_id'],
) {
    const { status } = await fetch('/api/ticket/assign', {
        method: 'DELETE',
        credentials: 'same-origin',
        body: new URLSearchParams({
            ticket,
            dept: dept.toString(10),
            user,
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
