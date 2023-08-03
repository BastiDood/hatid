import { DeptSchema } from './dept';
import { UserSchema } from './user';
import { z } from 'zod';

export const AgentSchema = z.object({
    dept_id: DeptSchema.shape.dept_id,
    user_id: UserSchema.shape.user_id,
    head: z.boolean(),
});

export type Agent = z.infer<typeof AgentSchema>;
