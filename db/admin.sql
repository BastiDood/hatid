SELECT user_id, name, email FROM users WHERE NOT admin;

\prompt 'Which user ID would you like to promote as a system administrator? ' uid

UPDATE users SET admin = TRUE WHERE user_id = :uid::TEXT;
