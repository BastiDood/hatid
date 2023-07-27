import { type Pending, PendingSchema } from './model/session';
import { ok, strictEqual } from 'node:assert/strict';
import { env } from '$env/dynamic/private';
import pg from 'postgres';

// Validate environment variables
const password = env.PGPASSWORD;
ok(password);
const host = env.PGHOST || '127.0.0.1';
const port = env.PGPORT ? parseInt(env.PGPORT, 10) : 5432;
const database = env.PGDATABASE || 'hatid';
const user = env.PGUSER || 'postgres';

// Global (private) connection pool
const sql = pg({ host, port, database, user, password });

/** Generates a brand new pending session via OAuth 2.0. */
export async function createSession(): Promise<Pending> {
    const [first, ...rest] = await sql`SELECT * FROM create_session()`.execute();
    strictEqual(rest.length, 0);
    return PendingSchema.parse(first);
}

/** Tear down the connection pool. Must be called at most once. */
export function end() {
    return sql.end();
}
