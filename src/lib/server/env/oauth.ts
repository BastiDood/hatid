import { env } from '$env/dynamic/private';
import { ok } from 'node:assert/strict';

const { GOOGLE_ID, GOOGLE_SECRET, OAUTH_REDIRECT } = env;
ok(GOOGLE_ID);
ok(GOOGLE_SECRET);

export default {
    GOOGLE_ID,
    GOOGLE_SECRET,
    OAUTH_REDIRECT: OAUTH_REDIRECT || 'http://127.0.0.1/auth/callback',
};
