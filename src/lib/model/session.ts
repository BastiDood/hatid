import { z } from 'zod';

export const PendingSchema = z.object({
    session_id: z.string(),
    nonce: z.instanceof(Uint8Array),
    expiration: z.coerce.date(),
});

export type Pending = z.infer<typeof PendingSchema>;
