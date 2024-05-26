import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	createStringOption,
} from "seyfert";
import { getImageOption, imageCommandOptions } from "@/lib/constants/options";

const reformatImageOptions = {
	format: createStringOption({
		name: "format",
		description: "The format to reformat the image to",
		required: true,
		choices: [
			{ name: "PNG", value: "png" },
			{ name: "JPG", value: "jpg" },
			{ name: "JPEG", value: "jpeg" },
			{ name: "WEBP", value: "webp" },
			{ name: "GIF", value: "gif" },
			{ name: "AVIF", value: "avif" },
			{ name: "TIFF", value: "tiff" },
			{ name: "HEIF", value: "heif" },
			{ name: "AUTO", value: "auto" },
		],
	}),
	...imageCommandOptions,
};

@Declare({
	name: "reformat",
	description: "Changes the format of an image",
})
@Options(reformatImageOptions)
export default class ImageReformatCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof reformatImageOptions>) {
		const source = await getImageOption(ctx);

		const image = await ctx.services.ipx<ArrayBuffer>(
			`/f_${ctx.options.format}/${source}`,
		);

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.${ctx.options.format ?? "png"}`);

		return ctx.editOrReply({
			files: [response],
		});
	}
}
