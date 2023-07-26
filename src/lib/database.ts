import { type Pending, PendingSchema } from './model/session';
import { ok, strictEqual } from 'node:assert/strict';
import pg, { type Sql } from 'postgres';
import { env } from '$env/dynamic/private';

export default class {
    /** Postgres connection pool. */
    #sql: Sql;

    /** Get database credentials from environment variables. */
    constructor() {
        const host = env.PGHOST || '127.0.0.1';
        const port = env.PGPORT ? parseInt(env.PGPORT, 10) : 5432;
        const database = env.PGDATABASE || 'hatid';
        const user = env.PGUSER || 'postgres';
        const password = env.PGPASSWORD;
        ok(password);
        this.#sql = pg({ host, port, database, user, password });
    }

    /** Generates a brand new pending session via OAuth 2.0. */
    async createSession(): Promise<Pending> {
        const [first, ...rest] = await this.#sql`SELECT * FROM create_session()`.execute();
        strictEqual(rest.length, 0);
        return PendingSchema.parse(first);
    }

    end() {
        return this.#sql.end();
    }
}
