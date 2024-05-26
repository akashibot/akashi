import { createEvent } from "seyfert";
import { image } from "../lib/structures/services/storage";
import { containsDiscordEmoji, getMessageMedia } from "../lib/utils/discord";
import { getGuildOrCreate } from "@akashi/db";
import { spacesAndStuffRegex } from "@/lib/constants/regexes";

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
		const guild = await getGuildOrCreate(message.guildId);

		if (guild.owsChannel === message.channelId && !message.author.bot) {
			const words = message.content.split(spacesAndStuffRegex);

			if (
				words.length !== 1 ||
				message.content.endsWith(".") ||
				containsDiscordEmoji(words.join(""))
			)
				await message.delete();
			else await message.react("✅");
		}
	},
});
