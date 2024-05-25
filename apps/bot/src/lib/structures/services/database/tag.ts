import { db, drizzle, schema } from "@akashi/db";
import { getMemberOrCreate } from "./member";

export async function getTag(name: string, guildId: string, emit = true) {
	const tag = await db.query.tags
		.findFirst({
			where: (table, { eq, and }) =>
				and(eq(table.name, name), eq(table.guildId, guildId)),
			with: {
				author: true,
			},
		})
		.execute();

	if (!tag && emit) throw new Error("Couldn't find this tag");

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
	nsfw: boolean,
	memberId: string,
	guildId: string,
) {
	const exists = await getTag(name, guildId, false);

	if (exists) throw new Error("This tag already exists on this guild");

	const [tag] = await db.transaction(async (tx) => {
		await getMemberOrCreate(memberId, guildId);
		const [tag] = await tx
			.insert(schema.tags)
			.values({
				name,
				content,
				nsfw,
				memberId,
				guildId,
			})
			.returning();

		return [tag];
	});

	return tag;
}
