import { Declare, Command, AutoLoad, CommandContext } from "seyfert";

@Declare({
	name: "image",
	description: "Image commands parent",
})
@AutoLoad()
export default class ImageParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: error instanceof Error ? error.message : `Error: ${error}`,
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

	private readonly ad: boolean = false;
}
