import { Message, createEvent } from "seyfert";
import { image } from "../lib/structures/services/storage";
import { getMessageMedia, runOwsChecks } from "../lib/utils/discord";

// Event to get embed images
export default createEvent({
	data: { name: "messageUpdate" },
	async run([message, _], client) {
		if (!message) return;
		if (message.author?.system) return;
		if (!message.guildId) return;
		if (!message.content) return;

		// Media caching stuff
		const messageMedia = await getMessageMedia(
			client,
			message.id,
			message.channelId,
		);

		if (messageMedia) await image.setItem(message.channelId, messageMedia);

		// One Word Story stuff
		await runOwsChecks(message as unknown as Message);
	},
});
