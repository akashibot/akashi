import { db, drizzle, schema } from "../";

export async function getUserOrCreate(id: string) {
	const user = await db.query.users
		.findFirst({
			where: (table, { eq }) => eq(table.id, id),
		})
		.execute();

	if (!user) return createUser(id);

	return user;
}

export async function createUser(id: string) {
	const [user] = await db
		.insert(schema.users)
		.values({
			id,
		})
		.returning();

	return user;
}

export async function removeUserTokens(id: string, tokens = 1) {
	const user = await getUserOrCreate(id);

	const [updateUser] = await db
		.update(schema.users)
		.set({
			tokens: user.tokens - tokens,
		})
		.where(drizzle.eq(schema.users.id, user.id))
		.returning();

	return updateUser;
}

export async function addUserTokens(id: string, tokens: number) {
	const user = await getUserOrCreate(id);

	const [updateUser] = await db
		.update(schema.users)
		.set({
			tokens: user.tokens + tokens,
		})
		.where(drizzle.eq(schema.users.id, user.id))
		.returning();

	return updateUser;
}
