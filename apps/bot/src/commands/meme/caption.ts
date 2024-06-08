import { getImageOption, imageCommandOptions } from "@/lib/constants/options";
import { Stopwatch } from "@sapphire/stopwatch";
import {
	AttachmentBuilder,
	type CommandContext,
	createStringOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert";

const captionOptions = {
	text: createStringOption({
		description: "Caption text",
		required: true,
	}),
	...imageCommandOptions,
};

@Declare({
	name: "caption",
	aliases: ["cap", "when"],
	description: "Caption an image",
})
@Options(captionOptions)
export default class CaptionMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof captionOptions>) {
		const source = await getImageOption(ctx);
		const stopwatch = new Stopwatch();

		const { text } = ctx.options;

		const image = await ctx.services.illumi.meme<ArrayBuffer, "arrayBuffer">(
			"/caption",
			{
				body: {
					image: source,
					caption: text,
				},
				onResponse: () => {
					stopwatch.stop();
				},
			},
		);

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.png`);

		return ctx.editOrReply({
			content: `Took ${stopwatch.toString()} ⌛`,
			files: [response],
		});
	}
}
