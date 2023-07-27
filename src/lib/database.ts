import pg, { type TransactionSql } from 'postgres';
import { PendingSchema } from './model/session';
import type { User } from './model/user';
import env from './env/postgres';
import { strictEqual } from 'node:assert/strict';

class Transaction {
    #sql: TransactionSql;

    constructor(sql: TransactionSql) {
        this.#sql = sql;
    }

    async deletePending(sid: string) {
        const [first, ...rest] = await this
            .#sql`SELECT nonce, expiration FROM delete_pending(${sid})`;
        strictEqual(rest.length, 0);
        return typeof first === 'undefined'
            ? null
            : PendingSchema.pick({ nonce: true, expiration: true }).parse(first);
    }

    async upgradePending(sid: string, uid: User['user_id'], exp: Date) {
        const { count } = await this.#sql`SELECT upgrade_pending(${sid}, ${uid}, ${exp})`;
        strictEqual(count, 0);
    }
}

// Global (private) connection pool
const sql = pg({
    host: env.PGHOST,
    port: env.PGPORT,
    database: env.PGDATABASE,
    user: env.PGUSER,
    password: env.PGPASSWORD,
});

/** Generates a brand new pending session via OAuth 2.0. */
export async function createPending() {
    const [first, ...rest] = await sql`SELECT * FROM create_pending()`.execute();
    strictEqual(rest.length, 0);
    return PendingSchema.parse(first);
}

export type TransactionScope<T> = (sql: Transaction) => T | Promise<T>;
export function begin<T>(fn: TransactionScope<T>) {
    return sql.begin(sql => fn(new Transaction(sql)));
}

/** Tear down the connection pool. Must be called at most once. */
export function end() {
    return sql.end();
}
