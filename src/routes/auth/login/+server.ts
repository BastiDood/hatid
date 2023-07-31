import { hash, load } from 'blake3';
import { OAUTH_SCOPE_STRING } from '$lib/server/model/google';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { createPending } from '$lib/server/database';
import env from '$lib/server/env/oauth';
import { fetchDiscoveryDocument } from '$lib/server/model/openid';
import { redirect } from '@sveltejs/kit';

// eslint-disable-next-line func-style
export const GET: RequestHandler = async ({ cookies }) => {
    // TODO: check if already logged in
    const { session_id, nonce, expiration } = await createPending();
    cookies.set('sid', session_id, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        expires: expiration,
    });

    await load();
    const params = new URLSearchParams({
        state: hash(session_id).toString('base64url'),
        client_id: env.GOOGLE_ID,
        redirect_uri: env.OAUTH_REDIRECT,
        nonce: Buffer.from(nonce).toString('base64url'),
        access_type: 'online',
        response_type: 'code',
        scope: OAUTH_SCOPE_STRING,
        prompt: 'select_account',
    });

    const { authorization_endpoint } = await fetchDiscoveryDocument();
    throw redirect(StatusCodes.MOVED_TEMPORARILY, `${authorization_endpoint}?${params}`);
};
