import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	createChannelOption,
	TextGuildChannel,
} from "seyfert";
import { getGuildOrCreate, updateGuildOrCreate } from "@akashi/db";
import { cn } from "@/lib/utils/format";
import { guildOwsChannel } from "@/lib/constants/storage-keys";

const configOwsSetOptions = {
	channel: createChannelOption({
		description: "Channel for the OWS",
		required: true,
	}),
};

@Declare({
	name: "set",
	description: "Configure One Word Story channel",
})
@Options(configOwsSetOptions)
export default class ConfigOwsSetCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof configOwsSetOptions>) {
		const { channel } = ctx.options as { channel: TextGuildChannel };

		const { owsChannel: oldChannel } = await getGuildOrCreate(ctx.guildId!);

		if (oldChannel === channel.id)
			throw new Error("That's the current One Word Story channel");

		await updateGuildOrCreate(ctx.guildId!, {
			owsChannel: channel.id,
		});
		await channel.edit({
			topic:
				"This is a One Word Story channel, you can only send one word per message.",
			rate_limit_per_user: 30,
		});
		await ctx.services.storages.custom.setItem<string>(
			guildOwsChannel(ctx.guildId!),
			channel.id,
		);

		return ctx.editOrReply({
			content: cn("One Word Story channel is now", channel.toString()),
		});
	}
}
