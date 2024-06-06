import {
	type CommandContext,
	Declare,
	SubCommand,
	AttachmentBuilder,
	Options,
	Middlewares,
	createNumberOption,
	createStringOption,
	createBooleanOption,
} from "seyfert";
import { getImageOption, imageCommandOptions } from "@/lib/constants/options";
import { sizeRegex } from "@/lib/constants/regexes";

const resizeOptions = {
	enlarge: createBooleanOption({
		description: "Allow the image to be upscaled",
	}),
	w: createNumberOption({
		description: "Width of the image",
	}),
	h: createNumberOption({
		description: "Height of the image",
	}),
	size: createStringOption({
		description: "Size of the image (E.g: 400x600)",
	}),
	...imageCommandOptions,
};

@Declare({
	name: "resize",
	description: "Resizes an image",
	aliases: ["size", "s"],
	props: {
		requiredTokens: 5,
	},
})
@Options(resizeOptions)
@Middlewares(["RequiredTokens"])
export default class InvertImageCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof resizeOptions>) {
		const source = await getImageOption(ctx);
		const { w, h, size, enlarge } = ctx.options;
		let resize: string;

		if (w && h) resize = `${w}x${h}`;
		else if (size?.match(sizeRegex)) resize = size;
		else resize = "400x600";

		const image = await ctx.services.ipx<ArrayBuffer>(
			`/${enlarge ? "enlarge," : ""}s_${resize}/${source}`,
		);

		const response = new AttachmentBuilder()
			.setFile("buffer", Buffer.from(image))
			.setName(`${this.name}.png`);

		return ctx.editOrReply({
			files: [response],
		});
	}
}
