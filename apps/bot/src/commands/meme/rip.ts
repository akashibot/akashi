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

@Declare({
	name: "rip",
	description: "R.I.P",
})
@Options(imageCommandOptions)
export default class RipMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageCommandOptions>) {
		const source = await getImageOption(ctx);

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
				texts: [
					{
						text: "OwO",
						x: 167,
						y: 383,
						font: "codsafd",
					},
				],
			},
		});

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.png`);

		return ctx.editOrReply({
			files: [response],
		});
	}
}
