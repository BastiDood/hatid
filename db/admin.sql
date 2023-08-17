SELECT user_id, name, email FROM users;

\prompt 'Which user ID would you like to promote as a system adminstrator? ' uid

UPDATE users SET admin = TRUE WHERE user_id = :uid::TEXT;
