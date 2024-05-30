import { eq } from "drizzle-orm";
import { db, schema } from "../";
import { PgUpdateSetSource } from "drizzle-orm/pg-core";

export async function getGuild(guildId: string) {
	const guild = await db.query.guilds
		.findFirst({
			where: (table, { eq }) => eq(table.id, guildId),
			with: {
				tags: true,
			},
		})
		.execute();

	return guild;
}

export async function getGuildOrThrow(guildId: string, cb: () => void) {
	const guild = await getGuild(guildId);

	if (!guild) throw cb();

	return guild;
}

export async function getGuildOrCreate(guildId: string) {
	const guild = await getGuild(guildId);

	if (!guild) return createGuild(guildId);

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

export async function updateGuildOrCreate(
	guildId: string,
	values: PgUpdateSetSource<typeof schema.guilds>,
) {
	const [updateGuild] = await db.transaction(async (tx) => {
		const guild = await getGuildOrCreate(guildId);

		const [updateGuild] = await tx
			.update(schema.guilds)
			.set(values)
			.where(eq(schema.guilds.id, guild.id))
			.returning();

		return [updateGuild];
	});

	return updateGuild;
}
