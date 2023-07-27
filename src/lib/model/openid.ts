import { z } from 'zod';

// @see https://cloud.google.com/iot/docs/how-tos/credentials/jwts#jwt_header
const Algorithm = z.enum(['RS256', 'ES256']);
const KeyId = z.string().min(1);

export const HeaderSchema = z.object({
    alg: Algorithm,
    typ: z.literal('JWT'),
    kid: KeyId,
});

const DiscoveryDocumentSchema = z.object({
    issuer: z.string().url(),
    authorization_endpoint: z.string().url(),
    token_endpoint: z.string().url(),
    userinfo_endpoint: z.string().url(),
    revocation_endpoint: z.string().url(),
    jwks_uri: z.string().url(),
});

const KeySchema = z.object({
    alg: Algorithm,
    use: z.literal('sig'),
    kid: KeyId,
});

const CertsResponseSchema = z.object({
    keys: KeySchema.passthrough().array(),
});

export type DiscoveryDocument = z.infer<typeof DiscoveryDocumentSchema>;

export async function fetchDiscoveryDocument(): Promise<DiscoveryDocument> {
    const res = await fetch('https://accounts.google.com/.well-known/openid-configuration');
    const json = await res.json();
    return DiscoveryDocumentSchema.parse(json);
}

export async function fetchCerts(url: string) {
    const res = await fetch(url);
    const json = await res.json();
    const { keys } = CertsResponseSchema.parse(json);

    const map = new Map<string, CryptoKey>();
    for (const jwk of keys) {
        const options =
            jwk.alg === 'RS256'
                ? { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }
                : { name: 'ECDSA', namedCurve: 'P-256' };
        const key = await crypto.subtle.importKey('jwk', jwk, options, false, ['verify']);
        map.set(jwk.kid, key);
    }
    return map;
}
