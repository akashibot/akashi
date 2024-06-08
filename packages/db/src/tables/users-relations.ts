import { relations } from "drizzle-orm";
import { tags } from "./tags";
import { users } from "./users";

export const usersRelations = relations(users, (helpers) => ({
	tags: helpers.many(tags, { relationName: "TagToUser" }),
}));
