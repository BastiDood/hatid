import { env } from '$env/dynamic/private';
import { ok } from 'node:assert/strict';

const { PGPASSWORD, PGHOST, PGPORT, PGDATABASE, PGUSER } = env;
ok(PGPASSWORD);

export default {
    PGHOST: PGHOST || '127.0.0.1',
    PGPORT: PGPORT ? parseInt(PGPORT, 10) : 5432,
    PGUSER: PGUSER || 'postgres',
    PGDATABASE: PGDATABASE || 'hatid',
    PGPASSWORD,
};
