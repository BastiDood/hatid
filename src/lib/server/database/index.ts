import { type Agent, AgentSchema } from '$lib/model/agent';
import {
    CreateTicketSchema,
    type Message,
    MessageSchema,
    type Ticket,
    type TicketLabel,
    TicketLabelSchema,
    TicketSchema,
} from '$lib/model/ticket';
import { type Dept, type DeptLabel, DeptLabelSchema, DeptSchema } from '$lib/model/dept';
import { type Label, LabelSchema } from '$lib/model/label';
import { type Pending, PendingSchema, type Session } from '$lib/server/model/session';
import { type Priority, PrioritySchema } from '$lib/model/priority';
import {
    UnexpectedConstraintName,
    UnexpectedErrorCode,
    UnexpectedRowCount,
    UnexpectedTableName,
} from './error';
import { type User, UserSchema } from '$lib/model/user';
import assert, { strictEqual } from 'node:assert/strict';
import pg, { type TransactionSql } from 'postgres';
import env from '$lib/server/env/postgres';
import { z } from 'zod';

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

const NullableBooleanResult = z.object({ result: z.boolean().nullable() });

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

/** Maps a session ID to its associated `admin` field in {@linkcode User}. */
export async function isAdminSession(sid: Session['session_id']) {
    const [first, ...rest] =
        await sql`SELECT admin FROM get_user_from_session(${sid}) AS _ WHERE _ IS NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined'
        ? null
        : UserSchema.pick({ admin: true }).parse(first).admin;
}

/** Maps a session ID to the department-level permissions of the `head` field in {@linkcode Agent}. */
export async function isHeadSession(sid: Session['session_id'], did: Agent['dept_id']) {
    const [first, ...rest] =
        await sql`SELECT * FROM is_head_session(${sid}, ${did}) AS head WHERE head IS NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined' ? null : AgentSchema.pick({ head: true }).parse(first).head;
}

/** Promotes a {@linkcode User} to a system administrator. Returns `true` if previously an admin. */
export async function setAdminForUser(uid: User['user_id'], admin: User['admin']) {
    const [first, ...rest] =
        await sql`SELECT * FROM set_admin_for_user(${uid}, ${admin}) AS admin WHERE admin IS NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined'
        ? null
        : UserSchema.pick({ admin: true }).parse(first).admin;
}

/** Creates a new {@linkcode Label}. The `color` is internally converted to an `INT`. */
export async function createLabel(
    title: Label['title'],
    color: Label['color'],
    days: Label['deadline'] = null,
) {
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
    const deadline = days === null ? null : `${days} days`;
    const [first, ...rest] =
        await sql`SELECT create_label(${title}, ${hex}, ${deadline}::INTERVAL DAY) AS label_id`.execute();
    strictEqual(rest.length, 0);
    return LabelSchema.pick({ label_id: true }).parse(first).label_id;
}

/** Edits the `title` field of a {@linkcode Label}. Returns `false` if not found. */
export async function editLabelTitle(lid: Label['label_id'], title: Label['title']) {
    const { count } =
        await sql`UPDATE labels SET title = ${title} WHERE label_id = ${lid}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

/** Edits the `color` field of a {@linkcode Label}. Returns `false` if not found. */
export async function editLabelColor(lid: Label['label_id'], color: Label['color']) {
    const hex = color >> 0;
    const { count } = await sql`UPDATE labels SET color = ${hex} WHERE label_id = ${lid}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

/** Edits the `deadline` field of a {@linkcode Label}. Returns `false` if not found. */
export async function editLabelDeadline(lid: Label['label_id'], days: Label['deadline']) {
    const deadline = days === null ? null : `${days} days`;
    const { count } =
        await sql`UPDATE labels SET deadline = ${deadline}::INTERVAL DAY WHERE label_id = ${lid}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

/** Creates a new {@linkcode Priority} or department. Requires only the department name as input.  */
export async function createPriority(title: Priority['title'], priority: Priority['priority']) {
    const [first, ...rest] =
        await sql`SELECT create_priority(${title}, ${priority}) AS priority_id`.execute();
    strictEqual(rest.length, 0);
    return PrioritySchema.pick({ priority_id: true }).parse(first).priority_id;
}

/** Edits the `title` field of a {@linkcode Priority}. Returns `false` if not found. */
export async function editPriorityTitle(pid: Priority['priority_id'], title: Priority['title']) {
    const { count } =
        await sql`UPDATE priorities SET title = ${title} WHERE priority_id = ${pid}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

/** Edits the `priority` field of a {@linkcode Priority}. Returns `false` if not found. */
export async function editPriorityLevel(
    pid: Priority['priority_id'],
    priority: Priority['priority'],
) {
    const { count } =
        await sql`UPDATE priorities SET priority = ${priority} WHERE priority_id = ${pid}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

/** Creates a new {@linkcode Dept} or department. Requires only the department name as input.  */
export async function createDept(name: Dept['name']) {
    const [first, ...rest] = await sql`SELECT create_dept(${name}) AS dept_id`.execute();
    strictEqual(rest.length, 0);
    return DeptSchema.pick({ dept_id: true }).parse(first).dept_id;
}

/** Edits the `name` field of a {@linkcode Dept}. Returns `false` if not found. */
export async function editDeptName(did: Dept['dept_id'], name: Dept['name']) {
    const { count } = await sql`UPDATE depts SET name = ${name} WHERE dept_id = ${did}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

export const enum AddDeptAgentResult {
    /** Department agent successfully added. */
    Success,
    /** Department agent already exists. No permissions changed. */
    AlreadyExists,
    /** Department does not exist. */
    NoDept,
    /** User does not exist. */
    NoUser,
}

/**
 * Adds a new {@linkcode Agent} user to the dept_agents table. Returns the
 * {@linkcode AddDeptAgentResult} for the operation.
 */
export async function addDeptAgent(did: Agent['dept_id'], uid: Agent['user_id']) {
    try {
        const { count } = await sql`SELECT add_dept_agent(${did}, ${uid})`.execute();
        strictEqual(count, 1);
        return AddDeptAgentResult.Success;
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name } = err;
        strictEqual(table_name, 'dept_agents');

        switch (code) {
            case '23503':
                switch (constraint_name) {
                    case 'dept_agents_dept_id_fkey':
                        return AddDeptAgentResult.NoDept;
                    case 'dept_agents_user_id_fkey':
                        return AddDeptAgentResult.NoUser;
                    default:
                        assert(constraint_name);
                        throw new UnexpectedConstraintName(constraint_name);
                }
            case '23505':
                assert(constraint_name, 'dept_agents_pkey');
                return AddDeptAgentResult.AlreadyExists;
            default:
                throw new UnexpectedErrorCode(code);
        }
    }
}

/**
 * Removes an {@linkcode Agent} user from the dept_agents table. Returns the `head` value of the removed agent
 * if successful or `null` if the department-user pair is not found in the table.
 */
export async function removeDeptAgent(did: Agent['dept_id'], uid: Agent['user_id']) {
    const [first, ...rest] =
        await sql`SELECT * FROM remove_dept_agent(${did}, ${uid}) AS head WHERE head is NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined' ? null : AgentSchema.pick({ head: true }).parse(first).head;
}

/** Promotes a {@linkcode Agent} to a department head. Returns `true` if already a department head. */
export async function setHeadForAgent(
    did: Agent['dept_id'],
    uid: Agent['user_id'],
    head: Agent['head'],
) {
    const [first, ...rest] =
        await sql`SELECT * FROM set_head_for_agent(${did}, ${uid}, ${head}) AS head WHERE head IS NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined' ? null : AgentSchema.pick({ head: true }).parse(first).head;
}

export enum SubscribeDeptToLabelResult {
    /** Subscription successfully added. */
    Success,
    /** Subscription already exists. No action taken. */
    Exists,
    /** Provided {@linkcode Dept} does not exist. */
    NoDept,
    /** Provided {@linkcode Label} does not exist. */
    NoLabel,
}

/** Opts in a {@linkcode Dept} to a {@linkcode Label}. */
export async function subscribeDeptToLabel(did: DeptLabel['dept_id'], lid: DeptLabel['label_id']) {
    try {
        const { count } = await sql`SELECT subscribe_dept_to_label(${did}, ${lid})`;
        strictEqual(count, 1);
        return SubscribeDeptToLabelResult.Success;
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name } = err;
        strictEqual(table_name, 'dept_labels');

        switch (code) {
            case '23503':
                switch (constraint_name) {
                    case 'dept_labels_dept_id_fkey':
                        return SubscribeDeptToLabelResult.NoDept;
                    case 'dept_labels_label_id_fkey':
                        return SubscribeDeptToLabelResult.NoLabel;
                    default:
                        assert(constraint_name);
                        throw new UnexpectedConstraintName(constraint_name);
                }
            case '23505':
                strictEqual(constraint_name, 'dept_labels_pkey');
                return SubscribeDeptToLabelResult.Exists;
            default:
                throw new UnexpectedErrorCode(code);
        }
    }
}

export const enum CreateTicketResult {
    /** Author not found. */
    NoAuthor,
    /** One of the provided labels did not exist. */
    NoLabels,
}

/**
 * Creates a new {@linkcode Ticket} and returns its `ticket_id`, `message_id`, `due_date` if
 * successful. Note that the PostgreSQL date for `infinity` would be replaced by the
 * {@link https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range maximum}
 * possible `Date` value, which roughly lands on September 13, 275760.
 */
export async function createTicket(
    title: Ticket['title'],
    author: Message['author_id'],
    body: Message['body'],
    labels: TicketLabel['label_id'][],
) {
    try {
        // Recall that PostgreSQL supports the `infinity` date, which is basically a sentinel value
        // that compares greater than all dates except `infinity` itself. Unfortunately, JavaScript
        // supports no such mechanism in the `Date` type.
        //
        // We thus consult the ECMAScript specification to find out that the maximum number of
        // milliseconds (since the Unix epoch) representable by the `Date` type is
        // `8_640_000_000_000_000`, which roughly lands on September 13, 275760. It is this exact
        // value so far in the future that we use in place of the PostgreSQL `infinity` date.
        //
        // More "native" and "low-level" PostgreSQL drivers such as that of the `postgres` crate
        // for the Rust programming language does in fact support distinguishing between regular
        // dates, `infinity`, and `-infinity`. But alas, this is impossible in JavaScript by its
        // very specification.
        //
        // [date-limits]: https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-time-values-and-time-range
        const [first, ...rest] =
            await sql`SELECT tid, mid, LEAST(due, to_timestamp(8640000000000)) AS due FROM create_ticket(${title}, ${author}, ${body}, ${labels})`.execute();
        strictEqual(rest.length, 0);
        return CreateTicketSchema.parse(first);
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name } = err;
        strictEqual(code, '23503');

        switch (table_name) {
            case 'ticket_labels':
                if (constraint_name === 'ticket_labels_label_id_fkey')
                    return CreateTicketResult.NoLabels;
                break;
            case 'messages':
                if (constraint_name === 'messages_author_id_fkey')
                    return CreateTicketResult.NoAuthor;
                break;
            default:
                assert(table_name);
                throw new UnexpectedTableName(table_name);
        }

        assert(constraint_name);
        throw new UnexpectedConstraintName(constraint_name);
    }
}

export const enum AssignTicketLabelResult {
    /** Label successfully assigned to ticket. */
    Success,
    /** Label already previously assigned to ticket. */
    AlreadyExists,
    /** Ticket does not exist. */
    NoTicket,
    /** Label does not exist. */
    NoLabel,
}

export async function assignTicketLabel(
    tid: TicketLabel['ticket_id'],
    lid: TicketLabel['label_id'],
) {
    try {
        const { count } = await sql`SELECT assign_label(${tid}, ${lid})`.execute();
        strictEqual(count, 1);
        return AssignTicketLabelResult.Success;
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name } = err;
        strictEqual(table_name, 'ticket_labels');

        switch (code) {
            case '23503':
                switch (constraint_name) {
                    case 'ticket_labels_ticket_id_fkey':
                        return AssignTicketLabelResult.NoTicket;
                    case 'ticket_labels_label_id_fkey':
                        return AssignTicketLabelResult.NoLabel;
                    default:
                        assert(constraint_name);
                        throw new UnexpectedConstraintName(constraint_name);
                }
            case '23505':
                strictEqual(constraint_name, 'ticket_labels_pkey');
                return AssignTicketLabelResult.AlreadyExists;
            default:
                throw new UnexpectedErrorCode(code);
        }
    }
}

export async function isTicketAuthor(tid: Ticket['ticket_id'], uid: Message['author_id']) {
    const [first, ...rest] =
        await sql`SELECT get_ticket_author(${tid}) = ${uid} AS result`.execute();
    strictEqual(rest.length, 0);
    return NullableBooleanResult.parse(first).result;
}

export async function isAssignedAgent(tid: Ticket['ticket_id'], uid: Agent['user_id']) {
    const [first, ...rest] =
        await sql`SELECT ${uid} IN get_assigned_agents(${tid}) AS result`.execute();
    strictEqual(rest.length, 0);
    return NullableBooleanResult.parse(first).result;
}

export async function canEditTicket(tid: Ticket['ticket_id'], uid: User['user_id']) {
    const [first, ...rest] =
        await sql`SELECT get_ticket_author(${tid}) = ${uid} OR ${uid} IN (SELECT * FROM get_assigned_agents(${tid})) AS result`.execute();
    strictEqual(rest.length, 0);
    return NullableBooleanResult.parse(first).result;
}

/** Edits the `title` field of a {@linkcode Ticket}. Returns `false` if not found. */
export async function editTicketTitle(tid: Ticket['ticket_id'], title: Ticket['title']) {
    const { count } =
        await sql`UPDATE tickets SET title = ${title} WHERE ticket_id = ${tid}`.execute();
    switch (count) {
        case 0:
            return false;
        case 1:
            return true;
        default:
            throw new UnexpectedRowCount(count);
    }
}

/**
 * Edits the `due_date` field of a {@linkcode Ticket}. Returns `true` if successful. Returns
 * `false` if the new due date is invalid. Otherwise, returns `null` if ticket cannot be found.
 */
export async function editTicketDueDate(
    tid: Ticket['ticket_id'],
    due: Ticket['due_date'] | null = null,
) {
    try {
        const date = due ?? 'infinity';
        const { count } =
            await sql`UPDATE tickets SET due_date = ${date} WHERE ticket_id = ${tid}`.execute();
        switch (count) {
            case 0:
                return null;
            case 1:
                return true;
            default:
                throw new UnexpectedRowCount(count);
        }
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, constraint_name } = err;
        strictEqual(code, '23514');
        strictEqual(constraint_name, 'expiration_check');
        return false;
    }
}

export const enum AssignTicketPriorityResult {
    /** Ticket priority successfully assigned. */
    Success,
    /** Ticket does not exist. */
    NoTicket,
    /** Provided priority id does not exist. */
    NoPriority,
}

/** Assigns `priority_id` field of a {@linkcode Ticket}. Returns the {@linkcode AssignTicketPriorityResult} for the operation. */
export async function assignTicketPriority(tid: Ticket['ticket_id'], pid: Ticket['priority_id']) {
    try {
        const { count } =
            await sql`UPDATE tickets SET priority_id = ${pid} WHERE ticket_id = ${tid}`.execute();
        switch (count) {
            case 0:
                return AssignTicketPriorityResult.NoTicket;
            case 1:
                return AssignTicketPriorityResult.Success;
            default:
                throw new UnexpectedRowCount(count);
        }
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name } = err;
        strictEqual(code, '23503');
        strictEqual(table_name, 'tickets');
        strictEqual(constraint_name, 'tickets_priority_id_fkey');
        return AssignTicketPriorityResult.NoPriority;
    }
}

export async function getAgentIdsByDept(did: Dept['dept_id']) {
    const rows = await sql`SELECT get_agents_by_dept(${did}) AS user_id`.execute();
    return AgentSchema.pick({ user_id: true })
        .array()
        .parse(rows)
        .map(agent => agent.user_id);
}

export async function getDepartments() {
    const rows = await sql`SELECT * FROM depts`.execute();
    return DeptSchema.array().parse(rows);
}

export async function getDeptLabels() {
    const rows = await sql`SELECT * FROM dept_labels`.execute();
    return DeptLabelSchema.array().parse(rows);
}

export async function getLabels() {
    const rows =
        await sql`SELECT label_id, title, color, EXTRACT(days FROM deadline)::INT AS deadline FROM labels`.execute();
    return LabelSchema.array().parse(rows);
}

export async function getMessages() {
    const rows = await sql`SELECT * FROM messages`.execute();
    return MessageSchema.array().parse(rows);
}

export async function getPendings() {
    const rows = await sql`SELECT * FROM pendings`.execute();
    return PendingSchema.array().parse(rows);
}

export async function getPriorities() {
    const rows = await sql`SELECT * FROM priorities`.execute();
    return PrioritySchema.array().parse(rows);
}

export async function getTickets() {
    const rows = await sql`SELECT * FROM tickets`.execute();
    return TicketSchema.array().parse(rows);
}

export async function getTicketLabels() {
    const rows = await sql`SELECT * FROM ticket_labels`.execute();
    return TicketLabelSchema.array().parse(rows);
}

export async function getUsers() {
    const rows = await sql`SELECT * FROM users`.execute();
    return UserSchema.array().parse(rows);
}

export async function getUsersOutsideDept(did: Dept['dept_id']) {
    const rows = await sql`SELECT * FROM get_users_outside_dept(${did})`.execute();
    return UserSchema.array().parse(rows);
}

export async function canAssignSelfToTicket(
    tid: Ticket['ticket_id'],
    did: Agent['dept_id'],
    uid: Agent['user_id'],
) {
    const [first, ...rest] =
        await sql`SELECT can_assign_self_to_ticket(${tid}, ${did}, ${uid}) AS result`.execute();
    strictEqual(rest.length, 0);
    return NullableBooleanResult.parse(first).result;
}

export const enum AssignAgentToTicketResult {
    /** {@linkcode Agent} successfully assigned to {@linkcode Ticket} */
    Success,
    /** {@linkcode Agent} has already been assigned before. */
    Exists,
    /** {@linkcode Ticket} does not exist. */
    NoTicket,
    /** {@linkcode Agent} does not exist. */
    NoAgent,
}

export async function assignAgentToTicket(
    tid: Ticket['ticket_id'],
    did: Agent['dept_id'],
    uid: Agent['user_id'],
) {
    try {
        const { count } = await sql`SELECT assign_agent_to_ticket(${tid}, ${did}, ${uid})`;
        strictEqual(count, 1);
        return AssignAgentToTicketResult.Success;
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name } = err;
        strictEqual(table_name, 'assignments');

        switch (code) {
            case '23503':
                switch (constraint_name) {
                    case 'assignments_ticket_id_fkey':
                        return AssignAgentToTicketResult.NoTicket;
                    case 'assignments_dept_id_user_id_fkey':
                        return AssignAgentToTicketResult.NoAgent;
                    default:
                        assert(constraint_name);
                        throw new UnexpectedConstraintName(constraint_name);
                }
            case '23505':
                strictEqual(constraint_name, 'assignments_pkey');
                return AssignAgentToTicketResult.Exists;
            default:
                throw new UnexpectedErrorCode(code);
        }
    }
}

export async function setStatusForTicket(tid: Ticket['ticket_id'], open: Ticket['open']) {
    const [first, ...rest] =
        await sql`SELECT * FROM set_status_for_ticket(${tid}, ${open}) AS open WHERE open IS NOT NULL`.execute();
    strictEqual(rest.length, 0);
    return typeof first === 'undefined'
        ? null
        : TicketSchema.pick({ open: true }).parse(first).open;
}

export const enum CreateReplyResult {
    /** The ticket has already been closed. */
    Closed = '0',
    /** The provided {@linkcode Ticket} does not exist. */
    NoTicket = '1',
    /** The provided {@linkcode User} does not exist. */
    NoUser = '2',
}

export async function createReply(
    tid: Message['ticket_id'],
    author: Message['author_id'],
    body: Message['body'],
) {
    try {
        const [first, ...rest] =
            await sql`SELECT * FROM create_reply(${tid}, ${author}, ${body}) AS message_id WHERE message_id IS NOT NULL`.execute();
        strictEqual(rest.length, 0);
        return typeof first === 'undefined'
            ? CreateReplyResult.Closed
            : MessageSchema.pick({ message_id: true }).parse(first).message_id;
    } catch (err) {
        const isExpected = err instanceof pg.PostgresError;
        if (!isExpected) throw err;

        const { code, table_name, constraint_name, routine } = err;
        switch (code) {
            case '23503':
                strictEqual(table_name, 'messages');
                strictEqual(constraint_name, 'messages_author_id_fkey');
                return CreateReplyResult.NoUser;
            case 'P0004':
                strictEqual(routine, 'exec_stmt_assert');
                return CreateReplyResult.NoTicket;
            default:
                assert(constraint_name);
                throw new UnexpectedConstraintName(constraint_name);
        }
    }
}
