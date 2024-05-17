import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
	Middlewares,
	Groups,
} from "seyfert";

@Declare({
	name: "admin",
	description: "Admin commands parent",
})
@Middlewares(["admin"])
@AutoLoad()
@Groups({
	tokens: {
		defaultDescription: "Admin tokens commands group",
	},
})
export default class AdminParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: error instanceof Error ? error.message : `Admin error: ${error}`,
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

	async onMiddlewaresError(ctx: CommandContext, error: string) {
		return ctx.editOrReply({
			content: error,
			flags: 4,
		});
	}
}
