import { z } from 'zod';

export const DeptSchema = z.object({
    dept_id: z.number().int().positive(),
    name: z.string().max(64),
});

export type Dept = z.infer<typeof DeptSchema>;
