import { Declare, Command, type CommandContext } from "seyfert";

@Declare({
	name: "ping",
	description: "Display Akashi's ping",
})
export default class UserCommand extends Command {
	async run(ctx: CommandContext) {
		const ping = ctx.client.gateway.latency;

		await ctx.write({
			content: `The ping is \`${ping}ms\``,
		});
	}
}
