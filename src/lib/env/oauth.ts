import { env } from '$env/dynamic/private';
import { ok } from 'node:assert/strict';

const { GOOGLE_ID, OAUTH_REDIRECT } = env;
ok(GOOGLE_ID);
ok(OAUTH_REDIRECT);

export default { GOOGLE_ID, OAUTH_REDIRECT };
