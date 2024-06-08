import { cn } from "@/lib/utils/format";
import { createTag } from "@akashi/db";
import {
	type CommandContext,
	Declare,
	Options,
	SubCommand,
	createBooleanOption,
	createStringOption,
} from "seyfert";

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
			ctx.author.id,
			ctx.guildId as string,
		);

		tag;

		return ctx.editOrReply({
			content: cn("Created tag", tag.name),
		});
	}
}
