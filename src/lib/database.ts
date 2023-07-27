import { type Pending, PendingSchema } from './model/session';
import env from './env/postgres';
import pg from 'postgres';
import { strictEqual } from 'node:assert/strict';

// Global (private) connection pool
const sql = pg({
    host: env.PGHOST,
    port: env.PGPORT,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
});

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
