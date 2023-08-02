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
    dept_id SERIAL NOT NULL REFERENCES depts (dept_id),
    user_id GoogleUserId REFERENCES users (user_id),
    head BOOLEAN NOT NULL,
    PRIMARY KEY (dept_id, user_id)
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
    ticket_id UUID NOT NULL DEFAULT gen_random_uuid(),
    title VARCHAR(128) NOT NULL,
    open BOOLEAN NOT NULL DEFAULT TRUE,
    due_date DATE NOT NULL DEFAULT 'infinity',
    priority_id SERIAL REFERENCES priorities (priority_id),
    PRIMARY KEY (ticket_id)
);

CREATE TABLE assignments(
    ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
    dept_id SERIAL NOT NULL,
    user_id GoogleUserId,
    PRIMARY KEY (ticket_id, dept_id, user_id),
    FOREIGN KEY (dept_id, user_id) REFERENCES dept_agents (dept_id, user_id)
);

CREATE TABLE messages(
    ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
    message_id SERIAL NOT NULL,
    creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    content VARCHAR(1024) NOT NULL,
    author_id GoogleUserId REFERENCES users (user_id),
    PRIMARY KEY (ticket_id, message_id)
);

CREATE TABLE labels(
    label_id SERIAL NOT NULL,
    title VARCHAR(32) NOT NULL,
    color INT NOT NULL,
    deadline INTERVAL DAY,
    PRIMARY KEY (label_id)
);

CREATE TABLE dept_labels(
    dept_id SERIAL NOT NULL REFERENCES depts (dept_id),
    label_id SERIAL NOT NULL REFERENCES labels (label_id),
    PRIMARY KEY (dept_id, label_id)
);

CREATE TABLE ticket_labels(
    ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
    label_id SERIAL NOT NULL REFERENCES labels (label_id),
    PRIMARY KEY (ticket_id, label_id)
);

-- SESSION FUNCTIONS

CREATE FUNCTION create_pending() RETURNS pendings AS $$
    INSERT INTO pendings DEFAULT VALUES RETURNING session_id, nonce, expiration;
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

CREATE FUNCTION is_head_session(sid sessions.session_id%TYPE, did depts.dept_id%TYPE) RETURNS dept_agents.head%TYPE AS $$
    SELECT head FROM sessions INNER JOIN dept_agents USING (user_id) WHERE session_id = sid AND dept_id = did;
$$ LANGUAGE SQL;

CREATE FUNCTION set_admin_for_user(uid users.user_id%TYPE, value users.admin%TYPE) RETURNS BOOLEAN AS $$
    WITH _ AS (SELECT admin FROM users WHERE user_id = uid)
        UPDATE users SET admin = value FROM _ WHERE user_id = uid RETURNING _.admin;
$$ LANGUAGE SQL;

-- LABEL FUNCTIONS

CREATE FUNCTION create_label(title labels.title%TYPE, color labels.color%TYPE, deadline labels.deadline%TYPE) RETURNS labels.label_id%TYPE AS $$
    INSERT INTO labels (title, color, deadline) VALUES (title, color, deadline) RETURNING label_id;
$$ LANGUAGE SQL;

-- DEPARTMENT FUNCTIONS

CREATE FUNCTION create_dept(name depts.name%TYPE) RETURNS depts.dept_id%TYPE AS $$
    INSERT INTO depts (name) VALUES (name) RETURNING dept_id;
$$ LANGUAGE SQL;
