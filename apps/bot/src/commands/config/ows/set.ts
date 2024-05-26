import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	Group,
	createChannelOption,
	TextGuildChannel,
} from "seyfert";
import { getGuildOrCreate, setOWSChannel } from "@akashi/db";
import { cn } from "@/lib/utils/format";

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
@Group("ows")
export default class ConfigOwsSetCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof configOwsSetOptions>) {
		const { channel } = ctx.options as { channel: TextGuildChannel };

		const { owsChannel: oldChannel } = await getGuildOrCreate(ctx.guildId!);

		if (oldChannel === channel.id)
			throw new Error("That's the current channel");

		await setOWSChannel(ctx.guildId!, channel.id);
		await channel.edit({
			topic:
				"This is a One-Word-Story channel, you can only send one word per message.",
			rate_limit_per_user: 30,
		});

		return ctx.editOrReply({
			content: cn("I have changed the OWS channel to ", channel.toString()),
		});
	}
}
