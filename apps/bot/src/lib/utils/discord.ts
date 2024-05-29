import {
	CommandContext,
	Message,
	OptionsRecord,
	UsingClient,
	WebhookMessage,
} from "seyfert";
import { SendResolverProps, When } from "seyfert/lib/common";
import { APIInteractionResponseCallbackData } from "seyfert/lib/types";
import { discordEmojiRegex, spacesAndStuffRegex } from "../constants/regexes";
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

export async function send<T extends OptionsRecord>(
	ctx: CommandContext<T>,
	body: Omit<
		APIInteractionResponseCallbackData,
		"embeds" | "components" | "poll"
	> &
		SendResolverProps & { variant?: "ok" | "err" | "info" },
): Promise<
	// biome-ignore lint/suspicious/noConfusingVoidType: eh
	When<false, WebhookMessage | Message, void | WebhookMessage | Message>
> {
	const match = {
		ok: "✅",
		err: "❌",
		info: "U+2139",
		default: "",
	};

	return ctx.editOrReply({
		content: `${match[body.variant ?? "default"]} ${body.content}`,
		...body,
	});
}

export function containsDiscordEmoji(content: string): boolean {
	return discordEmojiRegex.test(content);
}

export async function runOwsChecks(message: Message) {
	const owsChannel =
		(await custom.getItem<string>(guildOwsChannel(message.guildId!))) ??
		(await getGuildOrCreate(message.guildId!)).owsChannel;

	if (owsChannel === message.channelId) {
		const words = message.content.split(spacesAndStuffRegex);

		if (
			words.length !== 1 ||
			message.content.endsWith(".") ||
			containsDiscordEmoji(words.join(""))
		)
			await message.delete();
		else await message.react("✅");

		await custom.setItem<string>(guildOwsChannel(message.guildId!), owsChannel);
	}
}
