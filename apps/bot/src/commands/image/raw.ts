import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	createStringOption,
	Embed,
	Middlewares,
} from "seyfert";
import { getImageOption, imageCommandOptions } from "@/lib/constants/options";
import { imageMeta } from "image-meta";
import { spacesAndCommasRegex } from "@/lib/constants/regexes";
import { cnc, fileName } from "@/lib/utils/format";
import { MessageFlags } from "seyfert/lib/types";

export const imageRawCommandOptions = {
	operation: createStringOption({
		description:
			"Operation to perform, separated by commas. E.g: negate,f_webp",
		required: true,
	}),
	...imageCommandOptions,
};

@Declare({
	name: "raw",
	description: "Raw process an image",
	aliases: ["pipe", "custom"],
	props: {
		requiredTokens: 10,
	},
})
@Options(imageRawCommandOptions)
@Middlewares(["RequiredTokens"])
export default class RawImageCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageRawCommandOptions>) {
		const source = await getImageOption(ctx);
		const { operation } = ctx.options;
		const rawOperation = operation.split(spacesAndCommasRegex);

		console.log(operation, rawOperation);

		const image = await ctx.services.ipx<ArrayBuffer>(
			`/${rawOperation.join(",")}/${source}`,
		);

		const { type } = imageMeta(new Uint8Array(image));

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(fileName(ctx, type));

		const embed = new Embed()
			.setTitle("Raw Image")
			.setDescription(cnc(" ~> ", ...rawOperation))
			.setImage(`attachment://${fileName(ctx, type)}`)
			.setFooter({ text: cnc("/", "image", type ?? "png") });

		return ctx.editOrReply({
			embeds: [embed],
			files: [response],
			flags: MessageFlags.SuppressEmbeds,
		});
	}
}
