DROP TABLE "members";--> statement-breakpoint
ALTER TABLE "tags" RENAME COLUMN "memberId" TO "userId";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tokens" SET DEFAULT 200;