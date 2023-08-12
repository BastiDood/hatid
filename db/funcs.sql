-- SESSION FUNCTIONS
CREATE OR
REPLACE FUNCTION create_pending () RETURNS pendings AS $$
    INSERT INTO pendings DEFAULT VALUES RETURNING session_id, nonce, expiration;
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION delete_pending (
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

CREATE OR
REPLACE FUNCTION upgrade_pending (
    sid pendings.session_id %
    TYPE,
    uid users.user_id %
    TYPE,
    EXP sessions.expiration %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO sessions (session_id, user_id, expiration) VALUES (sid, uid, exp);
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION upsert_user (
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
CREATE OR
REPLACE FUNCTION get_user_from_session (
    sid sessions.session_id %
    TYPE
) RETURNS users AS $$
    SELECT users.* FROM sessions INNER JOIN users USING (user_id) WHERE session_id = sid;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION is_head_session (
    sid sessions.session_id %
    TYPE,
    did depts.dept_id %
    TYPE
) RETURNS dept_agents.head %
TYPE AS $$
    SELECT head FROM sessions INNER JOIN dept_agents USING (user_id) WHERE session_id = sid AND dept_id = did;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION set_admin_for_user (
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
CREATE OR
REPLACE FUNCTION create_label (
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
CREATE OR
REPLACE FUNCTION create_priority (
    title priorities.title %
    TYPE,
    priority priorities.priority %
    TYPE
) RETURNS priorities.priority_id %
TYPE AS $$
    INSERT INTO priorities (title, priority) VALUES (title, priority) RETURNING priority_id;
$$ LANGUAGE SQL;

-- DEPARTMENT FUNCTIONS
CREATE OR
REPLACE FUNCTION create_dept (
    NAME depts.name %
    TYPE
) RETURNS depts.dept_id %
TYPE AS $$
    INSERT INTO depts (name) VALUES (name) RETURNING dept_id;
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION add_dept_agent (
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO dept_agents (dept_id, user_id) VALUES (did, uid);
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION remove_dept_agent (
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE
) RETURNS dept_agents.head %
TYPE AS $$
    DELETE FROM dept_agents WHERE dept_id = did AND user_id = uid RETURNING head;
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION set_head_for_agent (
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

CREATE OR
REPLACE FUNCTION subscribe_dept_to_label (
    did dept_labels.dept_id %
    TYPE,
    lid dept_labels.label_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO dept_labels (dept_id, label_id) VALUES (did, lid);
$$ LANGUAGE SQL;

-- TICKET FUNCTIONS
CREATE OR
REPLACE FUNCTION create_reply (
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

CREATE OR
REPLACE FUNCTION assign_label (
    tid ticket_labels.ticket_id %
    TYPE,
    lid ticket_labels.label_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO ticket_labels (ticket_id, label_id) VALUES (tid, lid);
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION create_ticket (
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

CREATE OR
REPLACE FUNCTION get_ticket_author (
    tid tickets.ticket_id %
    TYPE
) RETURNS messages.author_id %
TYPE AS $$
    WITH _ AS (SELECT author_id, MIN(creation) FROM messages WHERE ticket_id = tid GROUP BY author_id)
        SELECT author_id FROM _;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION get_assigned_agents (
    tid assignments.ticket_id %
    TYPE
) RETURNS SETOF assignments.user_id %
TYPE AS $$
    SELECT user_id FROM assignments WHERE ticket_id = tid;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION get_assigned_departments (
    tid tickets.ticket_id %
    TYPE
) RETURNS TABLE (
    dept_id depts.dept_id %
    TYPE
) AS $$
    SELECT dept_id FROM dept_labels
        WHERE label_id IN (SELECT label_id FROM ticket_labels WHERE ticket_id = tid)
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION get_dept_agents (
    did dept_agents.dept_id %
    TYPE
) RETURNS SETOF dept_agents.user_id %
TYPE AS $$
    SELECT user_id FROM dept_agents WHERE dept_id = did;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION get_eligible_agents (
    tid tickets.ticket_id %
    TYPE,
    did dept_agents.dept_id %
    TYPE
) RETURNS SETOF dept_agents.user_id %
TYPE AS $$
    SELECT get_dept_agents(dept_id) AS user_id FROM get_assigned_departments(tid) WHERE dept_id = did;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION can_assign_self_to_ticket (
    tid tickets.ticket_id %
    TYPE,
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE
) RETURNS BOOLEAN AS $$
    WITH _ AS (SELECT get_eligible_agents(tid, did))
        SELECT uid IN (SELECT * FROM _) FROM _ WHERE _ IS NOT NULL;
$$ STABLE LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION get_agents_by_dept (
    did dept_agents.dept_id %
    TYPE
) RETURNS SETOF dept_agents.user_id %
TYPE AS $$
    SELECT user_id FROM dept_agents WHERE dept_id = did;
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION get_users_outside_dept (
    did depts.dept_id %
    TYPE
) RETURNS SETOF users AS $$
    SELECT * FROM users WHERE user_id NOT IN (SELECT * FROM get_agents_by_dept(did));
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION assign_agent_to_ticket (
    tid tickets.ticket_id %
    TYPE,
    did dept_agents.dept_id %
    TYPE,
    uid dept_agents.user_id %
    TYPE
) RETURNS VOID AS $$
    INSERT INTO assignments (ticket_id, dept_id, user_id) VALUES (tid, did, uid);
$$ LANGUAGE SQL;

CREATE OR 
REPLACE FUNCTION remove_agent_from_ticket (
    tid assignments.ticket_id %
    TYPE,
    did assignments.dept_id %
    TYPE,
    uid assignments.user_id %
    TYPE
) RETURNS VOID AS $$
    DELETE FROM assignments WHERE ticket_id = tid AND dept_id = did AND user_id = uid;
$$ LANGUAGE SQL;

CREATE OR
REPLACE FUNCTION set_status_for_ticket (
    tid tickets.ticket_id %
    TYPE,
    VALUE tickets.open %
    TYPE
) RETURNS tickets.open %
TYPE AS $$
    WITH _ AS (SELECT open FROM tickets WHERE ticket_id = tid)
        UPDATE tickets SET open = value FROM _ WHERE ticket_id = tid RETURNING _.open;
$$ LANGUAGE SQL;