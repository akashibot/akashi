import { db, schema } from "@akashi/db";
import { getGuildOrCreate } from "./guild";

export async function getMemberOrCreate(id: string, guildId: string) {
	await getGuildOrCreate(guildId);
	const member = await db.query.members
		.findFirst({
			where: (table, { eq, and }) =>
				and(eq(table.id, id), eq(table.guildId, guildId)),
		})
		.execute();

	if (!member) return createMember(id, guildId);

	return member;
}

export async function createMember(id: string, guildId: string) {
	const [member] = await db
		.insert(schema.members)
		.values({
			id,
			guildId,
			userId: id,
		})
		.returning();

	return member;
}
