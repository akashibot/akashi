-- Add migration script here
CREATE TABLE tags (
    name TEXT NOT NULL,
    user_id TEXT NOT NULL,
    guild_id TEXT NOT NULL,
    content TEXT NOT NULL,
    views INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Enforce unique constraint on the combination of name and guild_id
    CONSTRAINT unique_name_guild UNIQUE (name, guild_id)
);