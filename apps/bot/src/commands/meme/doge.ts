import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	createAttachmentOption,
} from "seyfert";
import { Stopwatch } from "@sapphire/stopwatch";

const dogeOptions = {
	doge: createAttachmentOption({
		description: "OP Doge",
		required: true,
	}),
	cheems: createAttachmentOption({
		description: "Weak cheems :P",
		required: true,
	}),
};

@Declare({
	name: "doge",
	description: "Idk how to describe this tbh",
})
@Options(dogeOptions)
export default class DogeMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof dogeOptions>) {
		const { doge, cheems } = ctx.options;
		const stopwatch = new Stopwatch();

		const image = await ctx.memge<ArrayBuffer, "arrayBuffer">("/custom", {
			body: {
				base: "https://github.com/akashibot/.github/blob/main/assets/templates/Buff-Doge-vs-Cheems.png?raw=true",
				images: [
					{
						url: doge.proxyUrl,
						x: 190,
						y: 50,
						resize: {
							w: 150,
						},
					},
					{
						url: cheems.proxyUrl,
						x: 700,
						y: 150,
						resize: {
							w: 150,
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
