import { BadInput, InsufficientPermissions, InvalidSession, UnexpectedStatusCode } from './error';
import { StatusCodes } from 'http-status-codes';
import type { User } from '$lib/model/user';

/**
 * Promotes/demotes a {@linkcode User} as a system administrator. Returns `true`
 * if modified. Otherwise, `false` means that the database made no modifications
 * because the intended new value is already its current value anyway. This probably
 * means that the client is out-of-sync with the server. We should probably refresh.
 */
export async function setAdmin(id: User['user_id'], admin: User['admin']) {
    const { status } = await fetch('/api/user/admin', {
        method: 'PATCH',
        credentials: 'same-origin',
        body: new URLSearchParams({ id, admin: Number(admin).toString(10) }),
    });
    switch (status) {
        case StatusCodes.NO_CONTENT:
            return true;
        case StatusCodes.RESET_CONTENT:
            return false;
        case StatusCodes.NOT_FOUND:
            return null;
        case StatusCodes.BAD_REQUEST:
            throw new BadInput();
        case StatusCodes.UNAUTHORIZED:
            throw new InvalidSession();
        case StatusCodes.FORBIDDEN:
            throw new InsufficientPermissions();
        default:
            throw new UnexpectedStatusCode(status);
    }
}
