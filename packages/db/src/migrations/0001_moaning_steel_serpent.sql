CREATE TABLE IF NOT EXISTS "guilds" (
	"id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" text PRIMARY KEY NOT NULL,
	"guildId" text NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"id" serial PRIMARY KEY NOT NULL,
	"guildId" text,
	"memberId" text NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"nsfw" boolean DEFAULT false NOT NULL
);
