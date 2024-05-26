import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
} from "seyfert";
import { formatError } from "@/lib/utils/format";

@Declare({
	name: "meme",
	description: "Meme commands parent",
})
@AutoLoad()
export default class MemeParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: formatError(error, this.name.toUpperCase()),
		});
	}

	async onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(([key, err]) => md.codeBlock(`${key}: ${err}`))
			.join("\n\n");

		return ctx.editOrReply({
			content: errors,
		});
	}

	async onMiddlewaresError(ctx: CommandContext, error: string) {
		return ctx.editOrReply({
			content: error,
			flags: 4,
		});
	}
}
