-- Add migration script here
alter table guilds
    add column board_cid text,
    add column board_emoji text,
    add column board_emoji_count smallint;