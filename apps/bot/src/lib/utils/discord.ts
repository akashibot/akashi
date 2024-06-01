import { Message, UsingClient } from "seyfert";
import { separationRegex } from "../constants/regexes";
import { getGuildOrCreate } from "@akashi/db";
import { custom } from "../structures/services/storage";
import { guildOwsChannel } from "../constants/storage-keys";

export function getMediaUrl(message: Message): string | undefined {
	if (message.attachments[0]?.proxyUrl) {
		return message.attachments[0].proxyUrl;
	}

	if (message.embeds[0]?.image?.proxyUrl) {
		return message.embeds[0]?.image?.proxyUrl;
	}

	if (message.embeds[0]?.thumbnail?.proxyUrl) {
		return message.embeds[0]?.thumbnail?.proxyUrl;
	}

	return undefined;
}

export async function getMessageMedia(
	client: UsingClient,
	messageId: string,
	channelId: string,
) {
	const message = await client.messages.fetch(messageId, channelId);

	if (!message) return undefined;

	return getMediaUrl(message);
}

export async function runOwsChecks(message: Message, edit = false) {
	const owsChannel =
		(await custom.getItem<string>(guildOwsChannel(message.guildId!))) ??
		(await getGuildOrCreate(message.guildId!)).owsChannel;

	if (owsChannel === message.channelId) {
		const words = message.content.split(separationRegex);

		if (words.length !== 1 || message.content.endsWith("."))
			await message.delete();
		else await message.react("✅");

		if (edit) await message.react("✏️");

		await custom.setItem<string>(guildOwsChannel(message.guildId!), owsChannel);
	}
}
