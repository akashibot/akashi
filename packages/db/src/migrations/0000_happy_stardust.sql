CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"tokens" integer DEFAULT 100 NOT NULL
);
