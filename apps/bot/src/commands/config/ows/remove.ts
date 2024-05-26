import { type CommandContext, Declare, SubCommand, Group } from "seyfert";
import { getGuildOrCreate, setOWSChannel } from "@akashi/db";

@Declare({
	name: "remove",
	description: "Remove the current OWS channel",
})
@Group("ows")
export default class ConfigOwsSetCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		const { owsChannel } = await getGuildOrCreate(ctx.guildId!);

		if (!owsChannel) throw new Error("You don't have a OWS channel set");

		await setOWSChannel(ctx.guildId!, null);

		return ctx.editOrReply({
			content: "I have removed the current OWS channel",
		});
	}
}
