import { Declare, Command, type CommandContext } from "seyfert";

@Declare({
	name: "ping",
	description: "Display Akashi's ping",
})
export default class UserCommand extends Command {
	async run(ctx: CommandContext) {
		await ctx.write({
			content: "The ping is `1ms`",
		});
	}
}
