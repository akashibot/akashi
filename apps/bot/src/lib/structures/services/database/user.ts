import { db, schemas, drizzle } from "@akashi/db";

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
		.insert(schemas.users)
		.values({
			id,
		})
		.returning();

	return user;
}

export async function removeUserTokens(id: string, tokens = 1) {
	const user = await getUserOrCreate(id);

	const [updateUser] = await db
		.update(schemas.users)
		.set({
			tokens: user.tokens - tokens,
		})
		.where(drizzle.eq(schemas.users.id, user.id))
		.returning();

	return updateUser;
}

export async function addUserTokens(id: string, tokens: number) {
	const user = await getUserOrCreate(id);

	const [updateUser] = await db
		.update(schemas.users)
		.set({
			tokens: user.tokens + tokens,
		})
		.where(drizzle.eq(schemas.users.id, user.id))
		.returning();

	return updateUser;
}
