import { type CommandContext, Declare, SubCommand } from "seyfert";
import { send } from "../../lib/utils/discord";

@Declare({
	name: "flush",
	description: "Flushes cache",
})
export default class AdminFlushCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		const flushed = await this.flush(ctx);

		return send(ctx, {
			content: Object.entries(flushed)
				.map(([name, isFlushed]) => `${isFlushed ? "✅" : "❌"} ${name}`)
				.join("\n"),
		});
	}

	private async flush(ctx: CommandContext) {
		await ctx.client.cache.adapter.flush();
		return {
			storage: await ctx.services.storages.storage
				.clear()
				.then(() => true)
				.catch(() => false),
			client: true,
		};
	}
}
