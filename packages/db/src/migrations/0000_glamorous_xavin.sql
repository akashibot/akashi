CREATE TABLE IF NOT EXISTS "guilds" (
	"id" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"name" text PRIMARY KEY NOT NULL,
	"guildId" text,
	"memberId" text NOT NULL,
	"content" text NOT NULL,
	"nsfw" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"tokens" integer DEFAULT 100 NOT NULL
);
