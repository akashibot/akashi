import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
} from "seyfert";
import {
	getImageOption,
	imageCommandOptions,
} from "../../lib/constants/options";
import { Stopwatch } from "@sapphire/stopwatch";

@Declare({
	name: "rip",
	description: "R.I.P",
})
@Options(imageCommandOptions)
export default class RipMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageCommandOptions>) {
		const source = await getImageOption(ctx);
		const stopwatch = new Stopwatch();

		const image = await ctx.memge<ArrayBuffer, "arrayBuffer">("/custom", {
			body: {
				base: "https://github.com/akashibot/.github/blob/main/assets/templates/rip.jpg?raw=true",
				images: [
					{
						url: source,
						x: 167,
						y: 383,
						resize: {
							w: 146,
						},
					},
				],
			},
			onResponse: () => {
				stopwatch.stop();
			},
		});

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.png`);

		return ctx.editOrReply({
			content: `Took ${stopwatch.toString()} ⌛`,
			files: [response],
		});
	}
}
