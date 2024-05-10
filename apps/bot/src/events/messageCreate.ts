import { createEvent } from "seyfert";
import { imageStorage } from "../lib/storage/image";
import { getMessageMedia } from "../lib/utils";

export default createEvent({
	data: { name: "messageCreate" },
	async run(message, client) {
		if (message.author.bot) return;
		if (message.author.system) return;

		const messageMedia = await getMessageMedia(
			client,
			message.id,
			message.channelId,
		);

		if (!messageMedia) return;

		await imageStorage.setItem(message.channelId, messageMedia);
	},
});
