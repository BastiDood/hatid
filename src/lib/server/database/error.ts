export class UnexpectedRowCount extends Error {
    constructor() {
        super('unexpected row count');
    }
}

export class UnexpectedTableName extends Error {
    #table: string;

    constructor(table: string) {
        super(`unexpected table ${table}`);
        this.#table = table;
    }

    get table() {
        return this.#table;
    }
}

export class UnexpectedConstraintName extends Error {
    #constraint: string;

    constructor(constraint: string) {
        super(`unexpected constraint ${constraint}`);
        this.#constraint = constraint;
    }

    get constraint() {
        return this.#constraint;
    }
}
