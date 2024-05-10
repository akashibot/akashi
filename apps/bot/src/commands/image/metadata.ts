import { type CommandContext, Declare, SubCommand, Options } from "seyfert";
import {
	getImageOption,
	imageCommandOptions,
} from "../../lib/constants/options";
import { imageMeta } from "image-meta";
import { md } from "mdbox";

@Declare({
	name: "metadata",
	description: "Display an image metadata",
})
@Options(imageCommandOptions)
export default class InvertImageCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof imageCommandOptions>) {
		const source = await getImageOption(ctx);
		const image = await ctx.ipx<ArrayBuffer>(`/_/${source}`);
		const metadata = imageMeta(Buffer.from(image));

		return ctx.editOrReply({
			content: md.codeBlock(JSON.stringify(metadata, null, 2)),
		});
	}
}
