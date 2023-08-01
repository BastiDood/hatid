import { GoogleUserId } from '$lib/model/user';
import { z } from 'zod';

const OAUTH_SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
];
export const OAUTH_SCOPE_STRING = OAUTH_SCOPES.join(' ');
export const OAUTH_TOKEN_TYPE = 'Bearer';

/** @see https://developers.google.com/identity/protocols/oauth2#size */
export const AuthorizationCode = z.string().min(1).max(256);

export const TokenResponseSchema = z.object({
    // JSON Web Token token containing the user's ID token.
    id_token: z.string().min(1),
    // Always set to `OAUTH_SCOPE` for now.
    scope: z
        .string()
        .transform(str => new Set(str.split(' ')))
        .refine(set => OAUTH_SCOPES.every(s => set.has(s))),
    // Always set to `OAUTH_TOKEN_TYPE` for now.
    token_type: z.literal(OAUTH_TOKEN_TYPE),
    // Remaining lifetime in seconds.
    expires_in: z.number().int(),
});

const UNIX_TIME_SECS = z
    .number()
    .int()
    .transform(secs => new Date(secs * 1000));
export const IdTokenSchema = z.object({
    // OpenID audience.
    aud: z.string(),
    // OpenID subject. Typically the globally unique Google user ID.
    sub: GoogleUserId,
    // Creation time (in seconds).
    iat: UNIX_TIME_SECS,
    // Expiration time (in seconds) on or after which the token is invalid.
    exp: UNIX_TIME_SECS,
    // OpenID issuer.
    iss: z.string(),
    // OpenID authorized presenter.
    azp: z.string().min(1),
    // Access token hash.
    at_hash: z.string().min(1),
    email: z.string().email(),
    email_verified: z.boolean(),
    name: z.string().min(1),
    nonce: z.string().min(1),
    picture: z.string().url(),
});
