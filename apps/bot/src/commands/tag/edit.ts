import { createTag, getTag, updateTag } from "@akashi/db";
import {
	type CommandContext,
	Declare,
	Options,
	SubCommand,
	createStringOption,
	Middlewares,
	createBooleanOption,
} from "seyfert";

const editOptions = {
	name: createStringOption({
		description: "Name of the tag",
		required: true,
	}),
	content: createStringOption({
		description: "New content of the tag",
		required: true,
	}),
	upsert: createBooleanOption({
		description: "Whether to create the tag if it doesn't exist",
		required: false,
	}),
};

@Declare({
	name: "edit",
	description: "Edit a tag from the guild",
	aliases: ["e", "update"],
})
@Options(editOptions)
@Middlewares(["TagOwner"])
export default class TagEditCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof editOptions>) {
		const { name, content, upsert } = ctx.options;

		const exists = await getTag(name, ctx.guildId!);

		if (upsert && !exists) {
			await createTag(name, content, ctx.author.id, ctx.guildId!);
		} else {
			await updateTag(name, ctx.guildId!, {
				content,
			});
		}

		return ctx.editOrReply({
			content: `Edited tag ${name}`,
		});
	}
}
