import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db, drizzle, schema } from "../";

export async function getUser(userId: string) {
	const user = await db.query.users
		.findFirst({
			where: (table, { eq }) => eq(table.id, userId),
			with: {
				tags: true,
			},
		})
		.execute();

	return user;
}

export async function getUserOrThrow(userId: string, cb: () => void) {
	const user = await getUser(userId);

	if (!user) return cb();

	return user;
}

export async function getUserOrCreate(userId: string) {
	const user = await getUser(userId);

	if (!user) return createUser(userId);

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

export async function updateUserOrCreate(
	userId: string,
	values: PgUpdateSetSource<typeof schema.users>,
) {
	const user = await getUserOrCreate(userId);

	const [updateUser] = await db
		.update(schema.users)
		.set(values)
		.where(drizzle.eq(schema.users.id, user.id))
		.returning();

	return updateUser;
}
