import { getImageOption, imageCommandOptions } from "@/lib/constants/options";
import { imageMeta } from "image-meta";
import { md } from "mdbox";
import { type CommandContext, Declare, Options, SubCommand } from "seyfert";

@Declare({
	name: "metadata",
	description: "Display an image metadata",
})
@Options(imageCommandOptions)
export default class MetadataImageCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageCommandOptions>) {
		const source = await getImageOption(ctx);
		const image = await ctx.services.ipx<ArrayBuffer>(`/_/${source}`);
		const metadata = imageMeta(Buffer.from(image));

		return ctx.editOrReply({
			content: md.codeBlock(
				Object.entries(metadata)
					.map(([field, value]) => `${field}: ${value}`)
					.join("\n"),
			),
		});
	}
}
