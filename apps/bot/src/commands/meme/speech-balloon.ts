import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
} from "seyfert";
import { getImageOption, imageCommandOptions } from "@/lib/constants/options";
import { Stopwatch } from "@sapphire/stopwatch";

@Declare({
	name: "speech-balloon",
	aliases: ["balloon", "speech", "sp"],
	description: "Look at him lololol",
})
@Options(imageCommandOptions)
export default class SpeechBalloonMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageCommandOptions>) {
		const source = await getImageOption(ctx);
		const stopwatch = new Stopwatch();

		const image = await ctx.services.illumi.meme<ArrayBuffer, "arrayBuffer">(
			"/speech-balloon",
			{
				body: {
					image: source,
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
