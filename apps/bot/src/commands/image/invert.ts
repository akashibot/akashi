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
		const source = await getImageOption(ctx);

		const image = await ctx.services.ipx<ArrayBuffer>(`/negate/${source}`);

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.png`);

		return ctx.editOrReply({
			files: [response],
		});
	}
}
