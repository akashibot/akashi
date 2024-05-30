import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const tags = pgTable("tags", {
	name: text("name").primaryKey(),
	guildId: text("guildId").notNull(),
	userId: text("userId").notNull(),
	content: text("content").notNull(),
	uses: integer("uses").default(0).notNull(),
});
