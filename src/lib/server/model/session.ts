import { UserSchema } from './user';
import { z } from 'zod';

const CommonSchema = z.object({
    session_id: z.string(),
    expiration: z.coerce.date(),
});

export const PendingSchema = CommonSchema.extend({
    nonce: z.instanceof(Uint8Array),
});

export const SessionSchema = CommonSchema.extend({
    user_id: UserSchema.shape.user_id,
});

export type Pending = z.infer<typeof PendingSchema>;
export type Session = z.infer<typeof SessionSchema>;
