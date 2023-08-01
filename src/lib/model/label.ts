import { z } from 'zod';

export const LabelSchema = z.object({
    label_id: z.number().int().positive(),
    title: z.string().max(32),
    color: z.number().int(),
    deadline: z.number().int().positive().nullable(),
});

export type Label = z.infer<typeof LabelSchema>;
