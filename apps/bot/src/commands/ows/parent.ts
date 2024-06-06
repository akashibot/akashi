import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	type CommandContext,
	type OnOptionsReturnObject,
	type PermissionStrings,
} from "seyfert";
import { cn, formatError } from "@/lib/utils/format";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "ows",
	description: "OWS commands parent",
	botPermissions: ["ViewChannel", "ManageChannels", "ManageMessages"],
	defaultMemberPermissions: ["ManageGuild"],
})
@AutoLoad()
export default class ConfigParent extends Command {
	onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		return ctx.editOrReply({
			content: formatError(error, this.name.toUpperCase()),
		});
	}

	onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(([key, err]) => md.codeBlock(`${key}: ${err.value}`))
			.join("\n\n");

		return ctx.editOrReply({
			content: errors,
		});
	}

	onMiddlewaresError(ctx: CommandContext, error: string) {
		return ctx.editOrReply({
			content: error,
			flags: MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds,
		});
	}

	onBotPermissionsFail(ctx: CommandContext, permissions: PermissionStrings) {
		return ctx.editOrReply({
			content: cn(
				"I need the following permissions to run this command:",
				permissions.join(", "),
			),
		});
	}

	onPermissionsFail(ctx: CommandContext, permissions: PermissionStrings) {
		return ctx.editOrReply({
			content: cn(
				"You need the following permissions to run this command:",
				permissions.join(", "),
			),
		});
	}
}
