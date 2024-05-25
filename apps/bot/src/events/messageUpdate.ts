import { createEvent } from "seyfert";
import { image } from "../lib/structures/services/storage";
import { getMessageMedia } from "../lib/utils/discord";

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

		if (messageMedia) await image.setItem(newMessage.channelId, messageMedia);
	},
});
