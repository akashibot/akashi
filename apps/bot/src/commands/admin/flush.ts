import { type CommandContext, Declare, SubCommand } from "seyfert";

@Declare({
	name: "flush",
	description: "Flushes cache",
})
export default class AdminFlushCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		await this.flush(ctx);

		return ctx.editOrReply({
			content: "Flushed cache",
		});
	}

	private async flush(ctx: CommandContext) {
		await ctx.services.storages.storage.clear();
	}
}
