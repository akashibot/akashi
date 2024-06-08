import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: text("id").primaryKey(),
	tokens: integer("tokens").default(200).notNull(),
});
