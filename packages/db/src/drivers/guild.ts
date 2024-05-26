import { eq } from "drizzle-orm";
import { db, schema } from "../";

export async function getGuildOrThrow(id: string) {
	const guild = await db.query.guilds
		.findFirst({
			where: (table, { eq }) => eq(table.id, id),
		})
		.execute();

	if (!guild) throw new Error("No guild found");

	return guild;
}

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

export async function setOWSChannel(
	guildId: string,
	owsChannelId: string | null,
) {
	const [guild] = await db
		.update(schema.guilds)
		.set({
			owsChannel: owsChannelId,
		})
		.where(eq(schema.guilds.id, guildId))
		.returning();

	return guild;
}
