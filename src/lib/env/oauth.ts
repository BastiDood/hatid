import { env } from '$env/dynamic/private';
import { ok } from 'node:assert/strict';

const { GOOGLE_ID, GOOGLE_SECRET, OAUTH_REDIRECT } = env;
ok(GOOGLE_ID);
ok(GOOGLE_SECRET);
ok(OAUTH_REDIRECT);

export default { GOOGLE_ID, GOOGLE_SECRET, OAUTH_REDIRECT };
