import { z } from 'zod';

export const PrioritySchema = z.object({
    priority_id: z.number().int().positive(),
    title: z.string().max(32),
    priority: z.number().int(),
});

export type Priority = z.infer<typeof PrioritySchema>;
