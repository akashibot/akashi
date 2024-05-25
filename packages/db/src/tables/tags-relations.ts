import { relations } from "drizzle-orm";
import { tags } from "./tags";
import { guilds } from "./guilds";
import { members } from "./members";

export const tagsRelations = relations(tags, (helpers) => ({
	guild: helpers.one(guilds, {
		relationName: "GuildToTag",
		fields: [tags.guildId],
		references: [guilds.id],
	}),
	author: helpers.one(members, {
		relationName: "MemberToTag",
		fields: [tags.memberId],
		references: [members.id],
	}),
}));
