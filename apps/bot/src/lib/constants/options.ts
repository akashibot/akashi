import {
	CommandContext,
	createAttachmentOption,
	createStringOption,
	createUserOption,
} from "seyfert";
import { httpsImageRegex } from "./regexes";

export const imageCommandOptions = {
	attachment: createAttachmentOption({
		description: "Image attachment",
		required: false,
	}),
	url: createStringOption({
		description: "Image url",
		required: false,
		value({ value }, ok, fail) {
			if (httpsImageRegex.test(value)) ok(value);
			else fail("Invalid url");
		},
	}),
	user: createUserOption({
		description: "User to get avatar from",
		required: false,
	}),
};

export async function getImageOption(
	ctx: CommandContext<typeof imageCommandOptions>,
): Promise<string> {
	const { options, channelId, services } = ctx;
	const { attachment, url, user } = options;

	const cache = await services.storages.image.getItem(channelId);
	const image =
		attachment?.proxyUrl ||
		(url as string | undefined) ||
		(user?.avatarURL() ?? undefined) ||
		cache?.toString() ||
		undefined;

	if (!image) throw new Error("No image found");

	return image;
}
