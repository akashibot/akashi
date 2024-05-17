import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
} from "seyfert";
import { MemgeError } from "../../lib/types/errors";

@Declare({
	name: "meme",
	description: "Meme commands parent",
})
@AutoLoad()
export default class MemeParent extends Command {
	async onRunError(ctx: CommandContext, error: MemgeError) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: md.codeBlock(
				`${error.url ?? ctx.command.name} threw an error: ${error.message}`,
			),
		});
	}

	async onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(
				([key, err]) => `${key}: ${err instanceof Error ? err.message : err}`,
			)
			.join("\n");

		return ctx.editOrReply({
			content: md.codeBlock(errors),
		});
	}
}
