import { Message, UsingClient } from "seyfert";

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

	const media = getMediaUrl(message);

	return media;
}
