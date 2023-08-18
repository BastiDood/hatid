import { LabelSchema } from '$lib/model/label';
import { PrioritySchema } from '$lib/model/priority';
import { UserSchema } from '$lib/model/user';
import { z } from 'zod';

export const TicketSchema = z.object({
    ticket_id: z.string().uuid(),
    title: z.string().max(128),
    open: z.boolean(),
    due_date: z.coerce.date(),
    priority_id: PrioritySchema.shape.priority_id.nullable(),
});

export const OpenTicketSchema = z.object({
    ticket_id: z.string().uuid(),
    title: z.string().max(128),
    due_date: z.coerce.date(),
    priority_id: PrioritySchema.shape.priority_id.nullable(),
});

export const TicketLabelSchema = z.object({
    ticket_id: TicketSchema.shape.ticket_id,
    label_id: LabelSchema.shape.label_id,
});

export const MessageSchema = z.object({
    author_id: UserSchema.shape.user_id,
    ticket_id: TicketSchema.shape.ticket_id,
    message_id: z.number().int().positive(),
    creation: z.coerce.date(),
    body: z.string().max(1024),
});

export const CreateTicketSchema = z.object({
    tid: TicketSchema.shape.ticket_id,
    mid: MessageSchema.shape.message_id,
    due: TicketSchema.shape.due_date,
});

export type OpenTicket = z.infer<typeof OpenTicketSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type TicketLabel = z.infer<typeof TicketLabelSchema>;
export type Message = z.infer<typeof MessageSchema>;

export type CreateTicket = z.infer<typeof CreateTicketSchema>;
