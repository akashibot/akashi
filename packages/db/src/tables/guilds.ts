import { pgTable, text } from "drizzle-orm/pg-core";

export const guilds = pgTable("guilds", { id: text("id").primaryKey() });
