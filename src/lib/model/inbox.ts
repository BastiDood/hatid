import { MessageSchema, TicketSchema } from './ticket';
import { DeptSchema } from './dept';
import { LabelSchema } from './label';
import { PrioritySchema } from './priority';
import { UserSchema } from './user';
import { z } from 'zod';

export enum Comparison {
    Less,
    Equal,
    Greater,
}

export const ComparisonSchema = z.nativeEnum(Comparison);

export const InboxQuerySchema = z
    .object({
        ticketTitle: TicketSchema.shape.title,
        ticketContent: MessageSchema.shape.body,
        dueDate: z.object({ date: TicketSchema.shape.due_date, ord: ComparisonSchema }),
        label: LabelSchema.shape.title,
        priorityTitle: PrioritySchema.shape.title,
        priorityValue: z.object({ priority: PrioritySchema.shape.priority, ord: ComparisonSchema }),
        userName: UserSchema.shape.name,
        userEmail: UserSchema.shape.email,
        dept: DeptSchema.shape.name,
    })
    .partial();

export type InboxQuery = z.infer<typeof InboxQuerySchema>;
