import { UsingClient } from "seyfert";

export async function getMessageMedia(
	client: UsingClient,
	messageId: string,
	channelId: string,
) {
	const message = await client.messages.fetch(messageId, channelId);

	if (!message) return undefined;

	const media =
		message.attachments[0]?.proxyUrl ??
		message.embeds[0]?.image?.proxyUrl ??
		undefined;

	if (!media) return undefined;

	return media;
}
