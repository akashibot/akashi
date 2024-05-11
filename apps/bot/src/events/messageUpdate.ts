import { createEvent } from "seyfert";
import { imageStorage } from "../lib/storage/image";
import { getMessageMedia } from "../lib/utils";

export default createEvent({
	data: { name: "messageUpdate" },
	async run([_, newMessage], client) {
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
