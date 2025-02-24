-- Add migration script here
alter table users
add column created_at timestamp;