import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
} from "seyfert";

@Declare({
	name: "image",
	description: "Image commands parent",
})
@AutoLoad()
export default class ImageParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: error instanceof Error ? error.message : `Image error: ${error}`,
		});
	}

	async onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(([key, err]) => `${key}: ${err.value}`)
			.join("\n");

		return ctx.editOrReply({
			content: md.codeBlock(errors),
		});
	}
}
