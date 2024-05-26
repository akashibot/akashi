import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	createStringOption,
	RequestMethod,
	AttachmentBuilder,
} from "seyfert";

const qrOptions = {
	text: createStringOption({
		description: "Text to create QR from",
		required: true,
	}),
};

@Declare({
	name: "qr",
	description: "Generate a custom QR",
})
@Options(qrOptions)
export default class UtilQRCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof qrOptions>) {
		const { text } = ctx.options;

		const qr = await ctx.services.illumi.util<ArrayBuffer, "arrayBuffer">(
			`/qr/svg?urlOrText=${text}`,
			{
				method: RequestMethod.Get,
				responseType: "arrayBuffer",
			},
		);

		const qrFile = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(qr))
			.setName("qr.png");

		return ctx.editOrReply({
			content: "📼 Here is your QR",
			files: [qrFile],
		});
	}
}
