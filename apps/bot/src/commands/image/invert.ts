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
	name: "invert",
	description: "Inverts an image",
})
@Options(imageCommandOptions)
export default class InvertImageCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageCommandOptions>) {
		const source = getImageOption(ctx);

		if (!source) return ctx.editOrReply({ content: "Please provide an image" });

		const image = await ctx.imageApi<ArrayBuffer>("/invert", {
			body: JSON.stringify({
				image: source,
			}),
		});

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName("invert.png");

		return ctx.editOrReply({
			files: [response],
		});
	}
}
