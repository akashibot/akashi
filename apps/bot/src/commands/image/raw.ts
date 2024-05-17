import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	createStringOption,
} from "seyfert";
import {
	getImageOption,
	imageCommandOptions,
} from "../../lib/constants/options";
import { imageMeta } from "image-meta";

export const imageRawCommandOptions = {
	operation: createStringOption({
		description:
			"Operation to perform, separated by commas. E.g: negate,f_webp",
		required: true,
	}),
	...imageCommandOptions,
};

@Declare({
	name: "raw",
	description: "Raw process an image",
})
@Options(imageRawCommandOptions)
export default class RawImageCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageRawCommandOptions>) {
		const source = await getImageOption(ctx);

		const image = await ctx.ipx<ArrayBuffer>(
			`/${ctx.options.operation}/${source}`,
		);

		const metadata = imageMeta(Buffer.from(image));

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.${metadata.type ?? "png"}`);

		return ctx.editOrReply({
			content:
				"Interested in processing images by yourself using Akashi? Read [this](https://github.com/akashibot/ipx?tab=readme-ov-file#modifiers)",
			files: [response],
			flags: 4,
		});
	}
}
