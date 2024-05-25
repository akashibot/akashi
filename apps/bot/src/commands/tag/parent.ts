import { md } from "mdbox";
import {
	AutoLoad,
	Command,
	CommandContext,
	Declare,
	OnOptionsReturnObject,
} from "seyfert";
import { formatError } from "../../lib/utils/format";

@Declare({
	name: "tag",
	description: "Tag commands parent",
})
@AutoLoad()
export default class TagParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: formatError(error, this.name.toUpperCase()),
		});
	}

	async onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(([key]) => `${key} is required!`)
			.join("\n");

		return ctx.editOrReply({
			content: md.codeBlock(errors),
		});
	}

	async onMiddlewaresError(ctx: CommandContext, error: string) {
		return ctx.editOrReply({
			content: error,
			flags: 4,
		});
	}
}
