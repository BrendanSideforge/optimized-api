
CREATE TABLE IF NOT EXISTS authorized_users (

    id SERIAL PRIMARY KEY,
    user_id TEXT,
    access_level INT,
    authorized_by TEXT,
    authorized_at TIMESTAMP

);
