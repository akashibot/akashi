import { relations } from "drizzle-orm";
import { guilds } from "./guilds";
import { tags } from "./tags";
import { users } from "./users";

export const tagsRelations = relations(tags, (helpers) => ({
	guild: helpers.one(guilds, {
		relationName: "GuildToTag",
		fields: [tags.guildId],
		references: [guilds.id],
	}),
	author: helpers.one(users, {
		relationName: "TagToUser",
		fields: [tags.userId],
		references: [users.id],
	}),
}));
