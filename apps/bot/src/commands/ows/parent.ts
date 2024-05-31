import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
	PermissionStrings,
} from "seyfert";
import { cn, formatError } from "@/lib/utils/format";

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

		// HOT FIX; DELETE THIS ASAP
		// if ((error as Error).message.includes("Permissions"))
		// https://github.com/tiramisulabs/seyfert/issues/198
		// 	this.onBotPermissionsFail(ctx, []);

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
			flags: 4,
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
