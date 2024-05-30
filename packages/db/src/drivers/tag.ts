import { PgUpdateSetSource } from "drizzle-orm/pg-core";
import { db, drizzle, getGuildOrCreate, getUserOrCreate, schema } from "../";
import { and, eq } from "drizzle-orm";

export async function getTag(name: string, guildId: string) {
	return db.query.tags
		.findFirst({
			where: (table, { eq, and }) =>
				and(eq(table.name, name), eq(table.guildId, guildId)),
			with: {
				author: true,
			},
		})
		.execute();
}

export async function getTagOrThrow(
	name: string,
	guildId: string,
	cb: () => void,
) {
	const tag = await getTag(name, guildId);

	if (!tag) throw cb();

	return tag!;
}

export async function removeTag(name: string, guildId: string) {
	await getTag(name, guildId);

	const [tag] = await db
		.delete(schema.tags)
		.where(
			drizzle.and(
				drizzle.eq(schema.tags.name, name),
				drizzle.eq(schema.tags.guildId, guildId),
			),
		)
		.returning();

	return tag;
}

export async function createTag(
	name: string,
	content: string,
	userId: string,
	guildId: string,
) {
	await getUserOrCreate(userId);
	await getGuildOrCreate(guildId);

	const exists = await getTag(name, guildId);

	if (exists) throw new Error("This tag already exists on this guild");

	const [tag] = await db.transaction(async (tx) => {
		const [tag] = await tx
			.insert(schema.tags)
			.values({
				name,
				content,
				userId,
				guildId,
			})
			.returning();

		return [tag];
	});

	return tag;
}

export async function updateTag(
	name: string,
	guildId: string,
	values: PgUpdateSetSource<typeof schema.tags>,
) {
	const [updateTag] = await db.transaction(async (tx) => {
		const [updateGuild] = await tx
			.update(schema.tags)
			.set(values)
			.where(and(eq(schema.tags.name, name), eq(schema.tags.guildId, guildId)))
			.returning();

		return [updateGuild];
	});

	return updateTag;
}
