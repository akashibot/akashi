import {
	CommandContext,
	createAttachmentOption,
	createStringOption,
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
			return value.startsWith("http")
				? ok(value)
				: fail("Image url must be a valid URL");
		},
	}),
};

export function getImageOption(
	ctx: CommandContext<typeof imageCommandOptions>,
): string | undefined {
	return (
		ctx.options.attachment?.proxyUrl ??
		(ctx.options.url as string).split("?")[0] ??
		undefined
	);
}
