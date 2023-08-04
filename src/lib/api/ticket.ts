import { BadInput, InvalidSession, UnexpectedStatusCode } from './error';
import { type Message, type Ticket, TicketSchema } from '$lib/model/ticket';
import type { Label } from '$lib/model/label';
import { StatusCodes } from 'http-status-codes';

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
            return TicketSchema.shape.ticket_id.parse(await res.text());
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
