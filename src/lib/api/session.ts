import { StatusCodes } from 'http-status-codes';
import { UnexpectedStatusCode } from './error';

/** Logs out the session. Returns `true` if successful. */
export async function logout() {
    const { status } = await fetch('/auth/logout', {
        method: 'DELETE',
        credentials: 'same-origin',
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.UNAUTHORIZED:
            return false;
        default:
            throw new UnexpectedStatusCode(status);
    }
}
