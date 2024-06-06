import { md } from "mdbox";
import {
	Declare,
	Command,
	AutoLoad,
	CommandContext,
	OnOptionsReturnObject,
} from "seyfert";
import { formatError } from "@/lib/utils/format";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "image",
	description: "Image commands parent",
	aliases: ["img", "i"],
})
@AutoLoad()
export default class ImageParent extends Command {
	async onRunError(ctx: CommandContext, error: unknown) {
		ctx.client.logger.fatal(error);

		await ctx.editOrReply({
			content: formatError(error, this.name.toUpperCase()),
		});
	}

	async onOptionsError(ctx: CommandContext, returns: OnOptionsReturnObject) {
		const errors = Object.entries(returns)
			.filter(([_, err]) => err.failed)
			.map(([key, err]) => md.codeBlock(`${key}: ${err.value}`))
			.join("\n\n");

		return ctx.editOrReply({
			content: errors,
		});
	}

	async onMiddlewaresError(ctx: CommandContext, error: string) {
		return ctx.editOrReply({
			content: error,
			flags: MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds,
		});
	}
}
