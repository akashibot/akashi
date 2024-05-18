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
) {
	const cache = await ctx.storage.image.getItem(ctx.channelId);
	const image =
		ctx.options.attachment?.proxyUrl ??
		ctx.options.url ??
		ctx.options.user?.avatarURL() ??
		cache ??
		undefined;

	if (!image) throw new Error("No image found");

	return image;
}
