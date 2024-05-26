import {
	type CommandContext,
	Declare,
	Options,
	SubCommand,
	createBooleanOption,
	createStringOption,
} from "seyfert";
import { send } from "@/lib/utils/discord.ts";
import { createTag } from "@akashi/db";

const createOptions = {
	name: createStringOption({
		description: "Name of the tag",
		required: true,
	}),
	content: createStringOption({
		description: "Content of the tag",
		required: true,
	}),
	nsfw: createBooleanOption({
		description: "Should be marked as NSFW?",
	}),
};

@Declare({
	name: "create",
	description: "Create a tag inside this guild",
	aliases: ["new", "add"],
})
@Options(createOptions)
export default class TagCreateCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof createOptions>) {
		const { name, content, nsfw } = ctx.options;

		if (!nsfw) ctx.options.nsfw = false;

		const tag = await createTag(
			name,
			content,
			nsfw as boolean,
			ctx.author.id,
			ctx.guildId as string,
		);

		tag;

		return send(ctx, {
			variant: "ok",
			content: `Created tag ${tag.name}`,
		});
	}
}
