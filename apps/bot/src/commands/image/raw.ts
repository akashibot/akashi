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
import { Stopwatch } from "@sapphire/stopwatch";
import { spacesAndCommasRegex } from "../../lib/constants/regexes";

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
		const stopwatch = new Stopwatch();
		const operation = ctx.options.operation
			.split(spacesAndCommasRegex)
			.join(",");

		const image = await ctx.services.ipx<ArrayBuffer>(
			`/${operation}/${source}`,
			{
				onResponse: () => {
					stopwatch.stop();
				},
			},
		);

		const metadata = imageMeta(Buffer.from(image));

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.${metadata.type ?? "png"}`);

		return ctx.editOrReply({
			content: `Took ${stopwatch.toString()} ⌛ | Want to make your own images? Read [this](https://github.com/akashibot/ipx?tab=readme-ov-file#modifiers)`,
			files: [response],
			flags: 4,
		});
	}
}
