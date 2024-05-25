import { relations } from "drizzle-orm";
import { members } from "./members";
import { users } from "./users";
import { tags } from "./tags";

export const membersRelations = relations(members, (helpers) => ({
	user: helpers.one(users, {
		relationName: "MemberToUser",
		fields: [members.id],
		references: [users.id],
	}),
	tags: helpers.many(tags, { relationName: "MemberToTag" }),
}));
