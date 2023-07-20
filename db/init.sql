CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- See `https://developers.google.com/identity/protocols/oauth2#size` for token sizes (in bytes).
-- Authorization Code: 256
-- Access Token:       2048
-- Refresh Token:      512
CREATE DOMAIN GoogleUserId AS VARCHAR(255) NOT NULL;
CREATE DOMAIN Email AS VARCHAR(32) NOT NULL;
CREATE DOMAIN Expiration AS TIMESTAMPTZ NOT NULL CHECK(VALUE > NOW());

CREATE TABLE staff(
    -- Google-assigned globally unique key.
    id GoogleUserId,
    name VARCHAR(64) NOT NULL,
    email Email UNIQUE,
    picture VARCHAR(256) NOT NULL,
    PRIMARY KEY (id)
);

-- Pending OAuth logins. Must expire periodically.
CREATE TABLE pending(
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    nonce BYTEA NOT NULL DEFAULT gen_random_bytes(64),
    expiration Expiration DEFAULT NOW() + INTERVAL '15 minutes',
    PRIMARY KEY (id)
);

-- Validated OAuth login.
CREATE TABLE session(
    id UUID NOT NULL,
    staff GoogleUserId REFERENCES staff (id),
    expiration Expiration,
    PRIMARY KEY (id)
);

CREATE FUNCTION create_session() RETURNS pending AS $$
    INSERT INTO pending DEFAULT VALUES RETURNING id, nonce, expiration
$$ LANGUAGE SQL;

CREATE FUNCTION upgrade_session(sid pending.id%TYPE, staff staff.id%TYPE) RETURNS Expiration AS $$
    DECLARE
        exp Expiration;
        out Expiration;
    BEGIN
        DELETE FROM pending WHERE id = sid RETURNING expiration STRICT INTO exp;
        INSERT INTO session (id, staff, expiration) VALUES (sid, staff, exp + '30 minutes') RETURNING expiration INTO out;
        RETURN out;
    END;
$$ LANGUAGE PLPGSQL;
