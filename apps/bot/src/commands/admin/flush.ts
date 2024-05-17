import { type CommandContext, Declare, SubCommand } from "seyfert";

@Declare({
	name: "flush",
	description: "Flushes cache",
})
export default class AdminFlushCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		ctx.client.cache.flush();

		return ctx.editOrReply({
			content: "Flushed cache",
		});
	}
}
