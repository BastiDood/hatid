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

export const TicketLabelSchema = z.object({
    ticket_id: TicketSchema.shape.ticket_id,
    label_id: LabelSchema.shape.label_id,
});

export const MessageSchema = z.object({
    creation: z.coerce.date(),
    author_id: UserSchema.shape.user_id,
    ticket_id: TicketSchema.shape.ticket_id,
    body: z.string().max(1024),
});

export const CreateTicketSchema = z.object({
    tid: TicketSchema.shape.ticket_id,
    mid: MessageSchema.shape.creation,
    due: TicketSchema.shape.due_date,
});

export const OpenTicketSchema = z.object({
    ticket_id: z.string().uuid(),
    title: z.string().max(128),
    due: z.coerce.date(),
    priority: PrioritySchema.pick({ title: true, priority: true }).nullable(),
});

export const TicketInfoSchema = z.object({
    title: TicketSchema.shape.title,
    open: TicketSchema.shape.open,
    due: TicketSchema.shape.due_date,
    priority: PrioritySchema.pick({ title: true, priority: true }).nullable(),
});

export type Ticket = z.infer<typeof TicketSchema>;
export type TicketLabel = z.infer<typeof TicketLabelSchema>;
export type Message = z.infer<typeof MessageSchema>;

export type CreateTicket = z.infer<typeof CreateTicketSchema>;
export type OpenTicket = z.infer<typeof OpenTicketSchema>;
export type TicketInfo = z.infer<typeof TicketInfoSchema>;
