-- Add migration script here
ALTER TABLE guilds 
DROP COLUMN IF EXISTS board_cid, 
DROP COLUMN IF EXISTS board_emoji, 
DROP COLUMN IF EXISTS board_emoji_count;

DROP TABLE IF EXISTS users;
