import { pgTable, text, boolean } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
	id: text("id").primaryKey(),
	guildId: text("guildId"),
	memberId: text("memberId").notNull(),
	name: text("name").notNull(),
	content: text("content").notNull(),
	nsfw: boolean("nsfw").default(false).notNull(),
});
