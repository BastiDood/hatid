import { AuthorizationCode, IdTokenSchema, TokenResponseSchema } from '$lib/model/google';
import { HeaderSchema, fetchCerts, fetchDiscoveryDocument } from '$lib/model/openid';
import { default as assert, ok, strictEqual } from 'node:assert/strict';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { begin } from '$lib/database';
import env from '$lib/env/oauth';
import { hash } from 'blake3';

// eslint-disable-next-line func-style
export const GET: RequestHandler = async ({ cookies, url: { searchParams } }) => {
    // TODO: check if the session already exists
    const sid = cookies.get('sid');
    if (!sid) throw redirect(StatusCodes.MOVED_TEMPORARILY, '/login');

    const state = searchParams.get('state');
    if (!state) throw error(StatusCodes.BAD_REQUEST);

    if (Buffer.from(state, 'base64url').compare(hash(sid)) !== 0)
        throw error(StatusCodes.BAD_REQUEST);

    await begin(async db => {
        const pending = await db.deletePending(sid);
        if (pending === null) throw redirect(StatusCodes.MOVED_PERMANENTLY, '/login');
        const { nonce, expiration } = pending;

        const result = AuthorizationCode.safeParse(searchParams.get('code'));
        if (!result.success) throw error(StatusCodes.BAD_REQUEST);
        const code = result.data;

        const body = new URLSearchParams({
            code,
            client_id: env.GOOGLE_ID,
            client_secret: env.GOOGLE_SECRET,
            redirect_uri: env.OAUTH_REDIRECT,
            grant_type: 'authorization_code',
        });

        const { token_endpoint, jwks_uri, issuer } = await fetchDiscoveryDocument();
        const res = await fetch(token_endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
        });

        // TODO: provide better status code
        ok(res.ok);

        const json = await res.json();
        const { id_token } = TokenResponseSchema.parse(json);

        // Parse the JSON web token
        const [first, second, signature, ...rest] = id_token.split('.');
        assert(rest.length === 0 && first && second && signature);

        // Parse the header
        const header = Buffer.from(first, 'base64').toString('ascii');
        const { alg, kid } = HeaderSchema.parse(JSON.parse(header));
        const algorithm =
            alg === 'RS256' ? { name: 'RSASSA-PKCS1-v1_5' } : { name: 'ECDSA', hash: 'SHA-256' };

        const keys = await fetchCerts(jwks_uri);
        const key = keys.get(kid);
        strictEqual(key?.algorithm.name, algorithm.name);

        const decodedSignature = Buffer.from(signature, 'base64');
        const payload = Buffer.from(`${first}.${second}`, 'ascii');
        assert(await crypto.subtle.verify(algorithm, key, decodedSignature, payload));

        const token = IdTokenSchema.parse(
            JSON.parse(Buffer.from(second, 'base64').toString('ascii')),
        );
        strictEqual(Buffer.from(token.nonce, 'base64url').compare(nonce), 0);
        strictEqual(token.aud, env.GOOGLE_ID);
        strictEqual(token.iss, issuer);
        assert(token.exp > new Date());
        ok(token.email_verified);
        await db.upgradePending(sid, token.sub, expiration);
    });

    throw redirect(StatusCodes.MOVED_TEMPORARILY, '/dashboard');
};
