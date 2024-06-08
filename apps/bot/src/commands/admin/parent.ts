import { formatError } from "@/lib/utils/format";
import { md } from "mdbox";
import {
	AutoLoad,
	Command,
	CommandContext,
	Declare,
	Groups,
	Middlewares,
	OnOptionsReturnObject,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "admin",
	description: "Admin commands parent",
})
@Middlewares(["Admin"])
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
			content: formatError(error, this.name.toUpperCase()),
		});
	}

	async onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(([key, err]) => md.codeBlock(`${key}: ${err.value}`))
			.join("\n\n");

		return ctx.editOrReply({
			content: errors,
		});
	}

	async onMiddlewaresError(ctx: CommandContext, error: string) {
		return ctx.editOrReply({
			content: error,
			flags: MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds,
		});
	}
}
