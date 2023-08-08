CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- See `https://developers.google.com/identity/protocols/oauth2#size` for token sizes (in bytes).
-- Authorization Code: 256
-- Access Token:       2048
-- Refresh Token:      512
CREATE DOMAIN GoogleUserId AS VARCHAR(255) NOT NULL;

CREATE DOMAIN Email AS VARCHAR(40) NOT NULL;

CREATE DOMAIN Expiration AS TIMESTAMPTZ NOT NULL CHECK (VALUE > NOW());

CREATE TABLE
    users (
        -- Google-assigned globally unique key.
        user_id GoogleUserId,
        NAME VARCHAR(64) NOT NULL,
        email Email UNIQUE,
        picture VARCHAR(256) NOT NULL,
        ADMIN BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (user_id)
    );

CREATE TABLE
    depts (
        dept_id SERIAL NOT NULL,
        NAME VARCHAR(64) NOT NULL,
        PRIMARY KEY (dept_id)
    );

CREATE TABLE
    dept_agents (
        dept_id INT NOT NULL REFERENCES depts (dept_id),
        user_id GoogleUserId REFERENCES users (user_id),
        head BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (dept_id, user_id)
    );

-- Pending OAuth logins. Must expire periodically.
CREATE TABLE
    pendings (
        session_id UUID NOT NULL DEFAULT gen_random_uuid (),
        nonce BYTEA NOT NULL DEFAULT gen_random_bytes (64),
        expiration Expiration DEFAULT NOW() + INTERVAL '15 minutes',
        PRIMARY KEY (session_id)
    );

-- Validated OAuth login.
CREATE TABLE
    sessions (
        session_id UUID NOT NULL,
        user_id GoogleUserId REFERENCES users (user_id),
        expiration Expiration,
        PRIMARY KEY (session_id)
    );

CREATE TABLE
    priorities (
        priority_id SERIAL NOT NULL,
        title VARCHAR(32) UNIQUE,
        priority INT NOT NULL,
        PRIMARY KEY (priority_id)
    );

CREATE TABLE
    tickets (
        ticket_id UUID NOT NULL DEFAULT gen_random_uuid (),
        title VARCHAR(128) NOT NULL,
        open BOOLEAN NOT NULL DEFAULT TRUE,
        due_date Expiration,
        priority_id INT REFERENCES priorities (priority_id),
        PRIMARY KEY (ticket_id)
    );

CREATE TABLE
    assignments (
        ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
        dept_id SERIAL NOT NULL,
        user_id GoogleUserId,
        PRIMARY KEY (ticket_id, dept_id, user_id),
        FOREIGN KEY (dept_id, user_id) REFERENCES dept_agents (dept_id, user_id) ON DELETE CASCADE
    );

CREATE TABLE
    messages (
        author_id GoogleUserId REFERENCES users (user_id),
        ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
        message_id SERIAL NOT NULL,
        creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        body VARCHAR(1024) NOT NULL,
        PRIMARY KEY (ticket_id, message_id)
    );

CREATE TABLE
    labels (
        label_id SERIAL NOT NULL,
        title VARCHAR(32) NOT NULL,
        color INT NOT NULL, -- Red Green Blue Alpha (RGBA)
        deadline INTERVAL DAY,
        PRIMARY KEY (label_id)
    );

CREATE TABLE
    dept_labels (
        dept_id INT NOT NULL REFERENCES depts (dept_id),
        label_id INT NOT NULL REFERENCES labels (label_id),
        PRIMARY KEY (dept_id, label_id)
    );

CREATE TABLE
    ticket_labels (
        ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
        label_id INT NOT NULL REFERENCES labels (label_id),
        PRIMARY KEY (ticket_id, label_id)
    );

-- SESSION FUNCTIONS
CREATE FUNCTION create_pending () RETURNS pendings AS $$
    INSERT INTO pendings DEFAULT VALUES RETURNING session_id, nonce, expiration;
$$ LANGUAGE SQL;

CREATE FUNCTION delete_pending (
    sid pendings.session_id %
    TYPE
) RETURNS TABLE (
    nonce pendings.nonce %
    TYPE,
    expiration pendings.expiration %
    TYPE
) AS $$
    DELETE FROM pendings WHERE session_id = sid RETURNING nonce, expiration;
$$ LANGUAGE SQL;

CREATE FUNCTION upgrade_pending (
    sid pendings.session_id %
    TYPE,
    uid users.user_id %
    TYPE,
    EXP sessions.expiration %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO sessions (session_id, user_id, expiration) VALUES (sid, uid, exp);
$$ LANGUAGE SQL;

CREATE FUNCTION upsert_user (
    uid users.user_id %
    TYPE,
    uname users.name %
    TYPE,
    addr users.email %
    TYPE,
    url users.picture %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO users (user_id, name, email, picture) VALUES (uid, uname, addr, url)
        ON CONFLICT (user_id) DO UPDATE SET name = uname, email = addr, picture = url;
$$ LANGUAGE SQL;

-- USER FUNCTIONS
CREATE FUNCTION get_user_from_session (
    sid sessions.session_id %
    TYPE
) RETURNS users AS $$
    SELECT users.* FROM sessions INNER JOIN users USING (user_id) WHERE session_id = sid;
$$ STABLE LANGUAGE SQL;

CREATE FUNCTION is_head_session (
    sid sessions.session_id %
    TYPE,
    did depts.dept_id %
    TYPE
) RETURNS dept_agents.head %
TYPE AS $$
    SELECT head FROM sessions INNER JOIN dept_agents USING (user_id) WHERE session_id = sid AND dept_id = did;
$$ STABLE LANGUAGE SQL;

CREATE FUNCTION set_admin_for_user (
    uid users.user_id %
    TYPE,
    VALUE users.admin %
    TYPE
) RETURNS users.admin %
TYPE AS $$
    WITH _ AS (SELECT admin FROM users WHERE user_id = uid)
        UPDATE users SET admin = value FROM _ WHERE user_id = uid RETURNING _.admin;
$$ LANGUAGE SQL;

-- LABEL FUNCTIONS
CREATE FUNCTION create_label (
    title labels.title %
    TYPE,
    color labels.color %
    TYPE,
    deadline labels.deadline %
    TYPE
) RETURNS labels.label_id %
TYPE AS $$
    INSERT INTO labels (title, color, deadline) VALUES (title, color, deadline) RETURNING label_id;
$$ LANGUAGE SQL;

-- PRIORITY FUNCTIONS
CREATE FUNCTION create_priority (
    title priorities.title %
    TYPE,
    priority priorities.priority %
    TYPE
) RETURNS priorities.priority_id %
TYPE AS $$
    INSERT INTO priorities (title, priority) VALUES (title, priority) RETURNING priority_id;
$$ LANGUAGE SQL;

-- DEPARTMENT FUNCTIONS
CREATE FUNCTION create_dept (
    NAME depts.name %
    TYPE
) RETURNS depts.dept_id %
TYPE AS $$
    INSERT INTO depts (name) VALUES (name) RETURNING dept_id;
$$ LANGUAGE SQL;

CREATE FUNCTION add_dept_agent (
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO dept_agents (dept_id, user_id) VALUES (did, uid);
$$ LANGUAGE SQL;

CREATE FUNCTION remove_dept_agent (
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE
) RETURNS dept_agents.head %
TYPE AS $$
    DELETE FROM dept_agents WHERE dept_id = did AND user_id = uid RETURNING head;
$$ LANGUAGE SQL;

CREATE FUNCTION set_head_for_agent (
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE,
    VALUE dept_agents.head %
    TYPE
) RETURNS dept_agents.head %
TYPE AS $$
    WITH _ AS (SELECT head FROM dept_agents WHERE dept_id = did AND user_id = uid)
        UPDATE dept_agents SET head = value FROM _ WHERE dept_id = did AND user_id = uid RETURNING _.head;
$$ LANGUAGE SQL;

CREATE FUNCTION subscribe_dept_to_label (
    did dept_labels.dept_id %
    TYPE,
    lid dept_labels.label_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO dept_labels (dept_id, label_id) VALUES (did, lid);
$$ LANGUAGE SQL;

-- TICKET FUNCTIONS
CREATE FUNCTION create_reply (
    tid messages.ticket_id %
    TYPE,
    author messages.author_id %
    TYPE,
    body messages.body %
    TYPE
) RETURNS messages.message_id %
TYPE AS $$
DECLARE
    valid tickets.open%TYPE;
    mid messages.message_id%TYPE;
BEGIN
    SELECT open STRICT INTO valid FROM tickets WHERE ticket_id = tid;
    ASSERT valid IS NOT NULL;
    IF valid THEN
        INSERT INTO messages (ticket_id, author_id, body) VALUES (tid, author, body)
            RETURNING message_id STRICT INTO mid;
    END IF;
    RETURN mid;
END;
$$ LANGUAGE PLPGSQL;

CREATE FUNCTION assign_label (
    tid ticket_labels.ticket_id %
    TYPE,
    lid ticket_labels.label_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO ticket_labels (ticket_id, label_id) VALUES (tid, lid);
$$ LANGUAGE SQL;

CREATE FUNCTION create_ticket (
    title tickets.title %
    TYPE,
    author messages.author_id %
    TYPE,
    body messages.body %
    TYPE,
    -- TODO: Use the type alias version once PostgreSQL supports the syntax.
    lids INT[]
) RETURNS TABLE (
    tid tickets.ticket_id %
    TYPE,
    mid messages.message_id %
    TYPE,
    due tickets.due_date %
    TYPE
) AS $$
DECLARE
    tid tickets.ticket_id%TYPE;
    mid messages.message_id%TYPE;
    due tickets.due_date%TYPE = 'infinity';
    min_deadline labels.deadline%TYPE;
BEGIN
    WITH _ AS (SELECT unnest(lids) AS label_id)
        SELECT MIN(deadline) STRICT INTO min_deadline FROM _ LEFT JOIN labels USING (label_id);
    INSERT INTO tickets (title, due_date) VALUES (title, COALESCE(NOW() + min_deadline, due))
        RETURNING ticket_id, due_date STRICT INTO tid, due;
    INSERT INTO messages (ticket_id, author_id, body) VALUES (tid, author, body)
        RETURNING message_id STRICT INTO mid;
    INSERT INTO ticket_labels (ticket_id, label_id) SELECT tid, unnest(lids);
    RETURN QUERY SELECT tid, mid, due;
END;
$$ LANGUAGE PLPGSQL;

CREATE FUNCTION get_ticket_author (
    tid tickets.ticket_id %
    TYPE
) RETURNS messages.author_id %
TYPE AS $$
    WITH _ AS (SELECT author_id, MIN(creation) FROM messages WHERE ticket_id = tid GROUP BY author_id)
        SELECT author_id FROM _;
$$ LANGUAGE SQL;

CREATE FUNCTION get_assigned_agents (
    tid assignments.ticket_id %
    TYPE
) RETURNS SETOF assignments.user_id %
TYPE AS $$
    SELECT user_id FROM assignments WHERE ticket_id = tid;
$$ LANGUAGE SQL;
