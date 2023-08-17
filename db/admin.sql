SELECT user_id, name, email FROM users;

\prompt 'Who do you want to promote as a system administrator? Insert the user ID. ' uid

UPDATE users SET admin = TRUE WHERE user_id = :uid::TEXT;
