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

CREATE INDEX idx_pending_expiration ON pendings (expiration);

-- Validated OAuth login.
CREATE TABLE
    sessions (
        session_id UUID NOT NULL,
        user_id GoogleUserId REFERENCES users (user_id),
        expiration Expiration,
        PRIMARY KEY (session_id)
    );

CREATE INDEX idx_sessions_expiration ON sessions (expiration);

CREATE TABLE
    priorities (
        priority_id SERIAL NOT NULL,
        title VARCHAR(32) NOT NULL UNIQUE,
        priority INT NOT NULL,
        PRIMARY KEY (priority_id)
    );

-- TODO: Should we also index by the title?
CREATE INDEX idx_priorities_priority ON priorities (priority);

CREATE TABLE
    tickets (
        ticket_id UUID NOT NULL DEFAULT gen_random_uuid (),
        title VARCHAR(128) NOT NULL,
        open BOOLEAN NOT NULL DEFAULT TRUE,
        due_date Expiration,
        priority_id INT REFERENCES priorities (priority_id),
        PRIMARY KEY (ticket_id)
    );

-- TODO: Should we also index by the title?
CREATE INDEX idx_tickets_due_date ON tickets (due_date);

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
        creation TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        author_id GoogleUserId REFERENCES users (user_id),
        ticket_id UUID NOT NULL REFERENCES tickets (ticket_id),
        body VARCHAR(1024) NOT NULL,
        PRIMARY KEY (creation)
    );

CREATE INDEX idx_messages_ticket_id ON messages (ticket_id);

CREATE TABLE
    labels (
        label_id SERIAL NOT NULL,
        title VARCHAR(32) NOT NULL UNIQUE,
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
