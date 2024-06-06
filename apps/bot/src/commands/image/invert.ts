import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	Middlewares,
} from "seyfert";
import { getImageOption, imageCommandOptions } from "@/lib/constants/options";

@Declare({
	name: "invert",
	description: "Inverts an image",
	props: {
		requiredTokens: 5,
	},
})
@Options(imageCommandOptions)
@Middlewares(["RequiredTokens"])
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
