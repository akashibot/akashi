import { type CommandContext, Declare, SubCommand } from "seyfert";
import { getGuildOrCreate, updateGuildOrCreate } from "@akashi/db";
import { guildOwsChannel } from "@/lib/constants/storage-keys";

@Declare({
	name: "remove",
	description: "Remove the current OWS channel",
})
export default class ConfigOwsSetCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		const { owsChannel } = await getGuildOrCreate(ctx.guildId!);

		if (!owsChannel) throw new Error("You don't have a OWS channel set");

		await updateGuildOrCreate(ctx.guildId!, {
			owsChannel: null,
		});
		await ctx.services.storages.custom.setItem<null>(
			guildOwsChannel(ctx.guildId!),
			null,
		);

		return ctx.editOrReply({
			content: "I have removed the current OWS channel",
		});
	}
}
