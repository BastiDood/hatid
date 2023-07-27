import { OAUTH_SCOPE_STRING } from '$lib/model/google';
import type { RequestHandler } from './$types';
import { StatusCodes } from 'http-status-codes';
import { createPending } from '$lib/database';
import env from '$lib/env/oauth';
import { fetchDiscoveryDocument } from '$lib/model/openid';
import { hash } from 'blake3';
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
