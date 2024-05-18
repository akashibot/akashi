import { createEvent } from "seyfert";
import { imageStorage } from "../lib/structures/services/storage";
import { getMessageMedia } from "../lib/utils";

// Event to get embed images
export default createEvent({
	data: { name: "messageUpdate" },
	async run([_, newMessage], client) {
		if (!newMessage) return;
		if (newMessage.author?.system) return;

		const messageMedia = await getMessageMedia(
			client,
			newMessage.id,
			newMessage.channelId,
		);

		if (messageMedia)
			await imageStorage.setItem(newMessage.channelId, messageMedia);
	},
});
