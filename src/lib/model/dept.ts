import { LabelSchema } from './label';
import { z } from 'zod';

export const DeptSchema = z.object({
    dept_id: z.number().int().positive(),
    name: z.string().max(64),
});

export const DeptLabelSchema = z.object({
    dept_id: DeptSchema.shape.dept_id,
    label_id: LabelSchema.shape.label_id,
});

export type Dept = z.infer<typeof DeptSchema>;
export type DeptLabel = z.infer<typeof DeptLabelSchema>;
