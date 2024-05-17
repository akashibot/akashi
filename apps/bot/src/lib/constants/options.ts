import {
	CommandContext,
	createAttachmentOption,
	createStringOption,
	createUserOption,
} from "seyfert";

export const imageCommandOptions = {
	attachment: createAttachmentOption({
		description: "Image attachment",
		required: false,
	}),
	url: createStringOption({
		description: "Image url",
		required: false,
		value({ value }, ok, fail) {
			const regex = /((https?:\/\/)?.*\.(?:png|gif|jpg|jpeg))/gi;

			if (regex.test(value)) ok(value);
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
	const image =
		ctx.options.attachment?.proxyUrl ??
		(ctx.options.url?.split("?")[0] as string) ??
		ctx.options.user?.avatarURL() ??
		(await ctx.storage.image.getItem(ctx.channelId)) ??
		undefined;

	if (!image) throw new Error("No image found");

	return image;
}
