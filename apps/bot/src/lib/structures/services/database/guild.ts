import { db, schema } from "@akashi/db";

export async function getGuildOrCreate(id: string) {
	const guild = await db.query.guilds
		.findFirst({
			where: (table, { eq }) => eq(table.id, id),
		})
		.execute();

	if (!guild) return createGuild(id);

	return guild;
}

export async function createGuild(id: string) {
	const [guild] = await db
		.insert(schema.guilds)
		.values({
			id,
		})
		.returning();

	return guild;
}
