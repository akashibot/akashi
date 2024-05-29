import { relations } from "drizzle-orm";
import { users } from "./users";
import { tags } from "./tags";

export const usersRelations = relations(users, (helpers) => ({
	tags: helpers.many(tags, { relationName: "TagToUser" }),
}));
