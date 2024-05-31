import { type CommandContext, Declare, SubCommand } from "seyfert";
import { getGuildOrCreate, updateGuildOrCreate } from "@akashi/db";
import { guildOwsChannel } from "@/lib/constants/storage-keys";

@Declare({
	name: "remove",
	description: "Remove the current One Word Story channel",
	botPermissions: ["ViewChannel", "ManageChannels", "ManageMessages"],
	defaultMemberPermissions: ["ManageGuild"],
})
export default class ConfigOwsSetCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		const { owsChannel } = await getGuildOrCreate(ctx.guildId!);

		if (!owsChannel)
			throw new Error("This guild doesn't have a One Word Story channel");

		await updateGuildOrCreate(ctx.guildId!, {
			owsChannel: null,
		});
		await ctx.services.storages.custom.setItem<null>(
			guildOwsChannel(ctx.guildId!),
			null,
		);

		return ctx.editOrReply({
			content: "Removed One Word Story channel",
		});
	}
}
