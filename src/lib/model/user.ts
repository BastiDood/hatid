import { GoogleUserId } from './google';
import { z } from 'zod';

export const UserSchema = z.object({
    user_id: GoogleUserId,
    name: z.string().max(64),
    email: z.string().max(40),
    picture: z.string().url(),
});

export type User = z.infer<typeof UserSchema>;
