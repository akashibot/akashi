import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	createAttachmentOption,
} from "seyfert";

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
    required: true
  })
};

@Declare({
	name: "distracted",
	description: "Distracted boyfriend",
})
@Options(distractedOptions)
export default class DistractedMemeCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof distractedOptions>) {
		const { boyfriend, girlfriend, girl: _girl } = ctx.options;

		const image = await ctx.memge<ArrayBuffer, "arrayBuffer">("/custom", {
			body: {
				base: "https://github.com/akashibot/.github/blob/main/assets/templates/Distracted-Boyfriend.jpg?raw=true",
				images: [
					{
						url: boyfriend.proxyUrl,
						x: 190,
						y: 50,
						resize: {
							w: 150,
						},
					},
					{
						url: girlfriend.proxyUrl,
						x: 700,
						y: 150,
						resize: {
							w: 150,
						},
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

