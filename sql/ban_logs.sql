
CREATE TABLE IF NOT EXISTS ban_logs (

    id SERIAL PRIMARY KEY,
    ban_id TEXT,
    server TEXT,
    moderator_id TEXT,
    discord_moderator_id TEXT,
    name TEXT,
    reason TEXT,
    evidence_link TEXT,
    bypassed BOOLEAN,
    created_at TIMESTAMP

)
