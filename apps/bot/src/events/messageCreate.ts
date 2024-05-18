import { createEvent } from "seyfert";
import { imageStorage } from "../lib/structures/services/storage/image";
import { getMessageMedia } from "../lib/utils";

// Event to get images
export default createEvent({
	data: { name: "messageCreate" },
	async run(message, client) {
		if (message.author.system) return;

		const messageMedia = await getMessageMedia(
			client,
			message.id,
			message.channelId,
		);

		if (messageMedia)
			await imageStorage.setItem(message.channelId, messageMedia);
	},
});
