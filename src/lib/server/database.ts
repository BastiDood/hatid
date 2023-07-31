import { type Label, LabelSchema } from '$lib/model/label';
import { type Pending, PendingSchema, type Session } from './model/session';
import { type User, UserSchema } from '$lib/model/user';
import { default as assert, strictEqual } from 'node:assert/strict';
import pg, { type TransactionSql } from 'postgres';
import env from './env/postgres';

class Transaction {
    #sql: TransactionSql;

    constructor(sql: TransactionSql) {
        this.#sql = sql;
    }

    async deletePending(sid: Pending['session_id']) {
        const [first, ...rest] = await this
            .#sql`SELECT nonce, expiration FROM delete_pending(${sid})`.execute();
        strictEqual(rest.length, 0);
        return typeof first === 'undefined'
            ? null
            : PendingSchema.pick({ nonce: true, expiration: true }).parse(first);
    }

    async upgradePending(sid: Pending['session_id'], uid: User['user_id'], exp: Date) {
        const { count } = await this.#sql`SELECT upgrade_pending(${sid}, ${uid}, ${exp})`.execute();
        assert(0 <= count && count < 2);
    }

    async upsertUser({
        user_id,
        name,
        email,
        picture,
    }: Pick<User, 'user_id' | 'name' | 'email' | 'picture'>) {
        const { count } = await this
            .#sql`SELECT upsert_user(${user_id}, ${name}, ${email}, ${picture})`.execute();
        assert(0 <= count && count < 2);
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

export type TransactionScope<T> = (sql: Transaction) => T | Promise<T>;

/** Starts a new transaction. */
export function begin<T>(fn: TransactionScope<T>) {
    return sql.begin(sql => fn(new Transaction(sql)));
}

/** Tear down the connection pool. Must be called at most once. */
export function end() {
    return sql.end();
}

/** Generates a brand new pending session via OAuth 2.0. */
export async function createPending() {
    const [first, ...rest] = await sql`SELECT * FROM create_pending()`.execute();
    strictEqual(rest.length, 0);
    return PendingSchema.parse(first);
}

/** Maps a session ID to its associated {@linkcode User}. */
export async function getUserFromSession(sid: Session['session_id']) {
    const [first, ...rest] =
        await sql`SELECT * FROM get_user_from_session(${sid}) AS _ WHERE _ IS NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined' ? null : UserSchema.parse(first);
}

/** Creates a new {@linkcode Label}. The `color` is internally converted to an `INT`. */
export async function createLabel(title: Label['title'], color: Label['color']) {
    // Recall that the `number` type in JavaScript is actually an IEEE-754-2019 double-precision
    // floating-point number. See [Section 6.1.6.1][ieee-754] for more details. However, note that
    // the `INT` type in Postgres is a 32-bit signed integer. We thus convert the `number` into a
    // valid `INT` via the signed right-shift operator. As detailed in the specification for the
    // signed right-shift operator in [Section 6.1.6.1.10][right-shift], the left operand is always
    // internally converted to a signed 32-bit integer (as needed by the `INT` type in Postgres).
    //
    // [ieee-754]: https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-ecmascript-language-types-number-type
    // [right-shift]: https://tc39.es/ecma262/multipage/ecmascript-data-types-and-values.html#sec-numeric-types-number-signedRightShift
    const hex = color >> 0;
    const [first, ...rest] = await sql`SELECT create_label(${title}, ${hex}) AS label_id`.execute();
    strictEqual(rest.length, 0);
    return LabelSchema.pick({ label_id: true }).parse(first);
}
