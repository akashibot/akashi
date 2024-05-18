import { createEvent } from "seyfert";
import { client as dbClient } from "@akashi/db";
import { ofetch } from "ofetch";

export default createEvent({
	data: { once: true, name: "botReady" },
	async run(user, client) {
		await dbClient
			.connect()
			.then(() => client.logger.info("Connected database"));

		if (process.env.NODE_ENV === "production")
			await postDlistGuildCount(
				user.id,
				(await client.cache.guilds?.count()) ?? 0,
			).then(() => client.logger.info("Posted guild count to dlist.gg"));

		client.logger.info(`${user.username} is ready`);
	},
});

async function postDlistGuildCount(id: string, count: number) {
	return ofetch<boolean>(`https://api.discordlist.gg/v0/bots/${id}/guilds`, {
		body: {
			count,
		},
		headers: {
			Authorization: `Bearer ${process.env.DLIST_API_KEY}`,
		},
		method: "POST",
	});
}
