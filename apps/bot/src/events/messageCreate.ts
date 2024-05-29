import { createEvent } from "seyfert";
import { image } from "../lib/structures/services/storage";
import { getMessageMedia, runOwsChecks } from "../lib/utils/discord";

// Event to get images
export default createEvent({
	data: { name: "messageCreate" },
	async run(message, client) {
		if (message.author.system) return;
		if (!message.guildId) return;

		// Media caching stuff
		const messageMedia = await getMessageMedia(
			client,
			message.id,
			message.channelId,
		);

		if (messageMedia) await image.setItem(message.channelId, messageMedia);

		// One Word Story stuff
		await runOwsChecks(message);
	},
});
