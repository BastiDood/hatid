export class UnexpectedRowCount extends Error {
    #count: number;

    constructor(count: number) {
        super(`unexpected row count ${count}`);
        this.#count = count;
    }

    get count() {
        return this.#count;
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

export class UnexpectedErrorCode extends Error {
    #code: string;

    constructor(code: string) {
        super(`unexpected error code ${code}`);
        this.#code = code;
    }

    get code() {
        return this.#code;
    }
}
