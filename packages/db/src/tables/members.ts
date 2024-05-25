import { pgTable, text } from "drizzle-orm/pg-core";

export const members = pgTable("members", {
	id: text("id").primaryKey(),
	guildId: text("guildId").notNull(),
});
