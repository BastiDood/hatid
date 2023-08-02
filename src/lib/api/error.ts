import type { StatusCodes } from 'http-status-codes';

export class UnexpectedStatusCode extends Error {
    #code: StatusCodes;

    constructor(code: StatusCodes) {
        super(`unexpected status code ${code}`);
        this.#code = code;
    }

    get code() {
        return this.#code;
    }
}

export class InvalidSession extends Error {
    constructor() {
        super('invalid session');
    }
}

export class InsufficientPermissions extends Error {
    constructor() {
        super('insufficient permissions');
    }
}

export class BadInput extends Error {
    constructor() {
        super('bad input');
    }
}
