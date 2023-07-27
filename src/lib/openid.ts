import { z } from 'zod';

const DiscoveryDocumentSchema = z.object({
    issuer: z.string().url(),
    authorization_endpoint: z.string().url(),
    token_endpoint: z.string().url(),
    userinfo_endpoint: z.string().url(),
    revocation_endpoint: z.string().url(),
    jwks_uri: z.string().url(),
});

const KeySchema = z.object({
    alg: z.enum(['RS256', 'ES256']),
    use: z.literal('sig'),
    kid: z.string().min(1),
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

export async function fetchCerts() {
    const { jwks_uri } = await fetchDiscoveryDocument();
    const res = await fetch(jwks_uri);
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
