import { pgTable, text, boolean } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
	name: text("name").primaryKey(),
	guildId: text("guildId"),
	memberId: text("memberId").notNull(),
	content: text("content").notNull(),
	nsfw: boolean("nsfw").default(false).notNull(),
});