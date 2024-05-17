import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
} from "seyfert";

@Declare({
	name: "meme",
	description: "Meme commands parent",
})
@AutoLoad()
export default class MemeParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: error instanceof Error ? error.message : `Meme error: ${error}`,
		});
	}

	async onAfterRun(ctx: CommandContext) {
		if (!this.ad) return;

		return ctx.interaction.followup({
			content:
				"Commander~! You've got a new mission! Vote for Akashi on [Dbots.fun](https://dbots.fun) and earn **500** image tokens!",
			flags: 64,
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

	private readonly ad: boolean = false;
}
