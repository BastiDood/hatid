import { BadInput, InvalidSession, UnexpectedStatusCode } from './error';
import { CreateTicketSchema, type Message, type Ticket } from '$lib/model/ticket';
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
