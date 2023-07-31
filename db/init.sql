CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- See `https://developers.google.com/identity/protocols/oauth2#size` for token sizes (in bytes).
-- Authorization Code: 256
-- Access Token:       2048
-- Refresh Token:      512
CREATE DOMAIN GoogleUserId AS VARCHAR(255) NOT NULL;
CREATE DOMAIN Email AS VARCHAR(40) NOT NULL;
CREATE DOMAIN Expiration AS TIMESTAMPTZ NOT NULL CHECK(VALUE > NOW());

CREATE TABLE users(
    -- Google-assigned globally unique key.
    user_id GoogleUserId,
    name VARCHAR(64) NOT NULL,
    email Email UNIQUE,
    picture VARCHAR(256) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id)
);

CREATE TABLE depts(
    dept_id SERIAL NOT NULL,
    name VARCHAR(64) NOT NULL,
    PRIMARY KEY (dept_id)
);

CREATE TABLE dept_agents(
    dept_agent_id SERIAL NOT NULL,
    dept_id SERIAL NOT NULL REFERENCES depts (dept_id),
    user_id GoogleUserId REFERENCES users (user_id),
    head BOOLEAN NOT NULL,
    PRIMARY KEY (dept_agent_id)
);

-- Pending OAuth logins. Must expire periodically.
CREATE TABLE pendings(
    session_id UUID NOT NULL DEFAULT gen_random_uuid(),
    nonce BYTEA NOT NULL DEFAULT gen_random_bytes(64),
    expiration Expiration DEFAULT NOW() + INTERVAL '15 minutes',
    PRIMARY KEY (session_id)
);

-- Validated OAuth login.
CREATE TABLE sessions(
    session_id UUID NOT NULL,
    user_id GoogleUserId REFERENCES users (user_id),
    expiration Expiration,
    PRIMARY KEY (session_id)
);

CREATE TABLE priorities(
    priority_id SERIAL NOT NULL,
    title VARCHAR(32) UNIQUE,
    priority INT NOT NULL UNIQUE,
    PRIMARY KEY (priority_id)
);

CREATE TABLE tickets(
    ticket_id UUID NOT NULL,
    title VARCHAR(128) NOT NULL,
    open BOOLEAN NOT NULL,
    deadline DATE,
    priority_id SERIAL REFERENCES priorities (priority_id),
    PRIMARY KEY (ticket_id)
);

CREATE TABLE assignments(
    ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
    agent_id SERIAL NOT NULL REFERENCES dept_agents (dept_agent_id),
    PRIMARY KEY (ticket_id, agent_id)
);

CREATE TABLE messages(
    message_id UUID NOT NULL,
    ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
    creation TIMESTAMPTZ NOT NULL,
    content VARCHAR(1024) NOT NULL,
    author_id GoogleUserId REFERENCES users (user_id),
    PRIMARY KEY (message_id)
);

CREATE TABLE labels(
    label_id SERIAL NOT NULL,
    title VARCHAR(32) NOT NULL,
    color INT NOT NULL,
    PRIMARY KEY (label_id)
);

CREATE TABLE dept_labels(
    dept_id SERIAL NOT NULL REFERENCES depts (dept_id),
    label_id SERIAL NOT NULL REFERENCES labels (label_id),
    PRIMARY KEY (dept_id, label_id)
);

-- TODO: Let's consider a different name for the bridge table.
CREATE TABLE ticket_labels(
    ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
    label_id SERIAL NOT NULL REFERENCES labels (label_id),
    PRIMARY KEY (ticket_id, label_id)
);

-- SESSION FUNCTIONS

CREATE FUNCTION create_pending() RETURNS pendings AS $$
    INSERT INTO pendings DEFAULT VALUES RETURNING session_id, nonce, expiration
$$ LANGUAGE SQL;

CREATE FUNCTION delete_pending(sid pendings.session_id%TYPE) RETURNS TABLE(nonce pendings.nonce%TYPE, expiration pendings.expiration%TYPE) AS $$
    DELETE FROM pendings WHERE session_id = sid RETURNING nonce, expiration;
$$ LANGUAGE SQL;

CREATE FUNCTION upgrade_pending(sid pendings.session_id%TYPE, uid users.user_id%TYPE, exp sessions.expiration%TYPE) RETURNS VOID AS $$
    INSERT INTO sessions (session_id, user_id, expiration) VALUES (sid, uid, exp);
$$ LANGUAGE SQL;

CREATE FUNCTION upsert_user(uid users.user_id%TYPE, uname users.name%TYPE, addr users.email%TYPE, url users.picture%TYPE) RETURNS VOID AS $$
    INSERT INTO users (user_id, name, email, picture) VALUES (uid, uname, addr, url)
        ON CONFLICT (user_id) DO UPDATE SET name = uname, email = addr, picture = url;
$$ LANGUAGE SQL;

-- USER FUNCTIONS

CREATE FUNCTION get_user_from_session(sid sessions.session_id%TYPE) RETURNS users AS $$
    SELECT users.* FROM sessions INNER JOIN users USING (user_id) WHERE session_id = sid;
$$ LANGUAGE SQL;

-- TICKET FUNCTIONS
