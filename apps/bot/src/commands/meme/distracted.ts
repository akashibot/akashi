import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	createAttachmentOption,
} from "seyfert";
import { Stopwatch } from "@sapphire/stopwatch";

const distractedOptions = {
	boyfriend: createAttachmentOption({
		description: "The boyfriend image",
		required: true,
	}),
	girlfriend: createAttachmentOption({
		description: "The girlfriend image",
		required: true,
	}),
	girl: createAttachmentOption({
		description: "The girl image",
		required: true,
	}),
};

@Declare({
	name: "distracted",
	description: "Distracted boyfriend",
})
@Options(distractedOptions)
export default class DistractedMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof distractedOptions>) {
		const { boyfriend, girlfriend, girl } = ctx.options;
		const stopwatch = new Stopwatch();

		const image = await ctx.services.illumi.meme<ArrayBuffer, "arrayBuffer">(
			"/custom",
			{
				body: {
					base: "https://github.com/akashibot/.github/blob/main/assets/templates/Distracted-Boyfriend.jpg?raw=true",
					images: [
						{
							url: boyfriend.proxyUrl,
							x: 662,
							y: 351,
							resize: {
								w: 200,
							},
						},
						{
							url: girlfriend.proxyUrl,
							x: 925,
							y: 451,
							resize: {
								w: 200,
							},
						},
						{
							url: girl.proxyUrl,
							x: 238,
							y: 551,
							resize: {
								w: 200,
							},
						},
					],
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
