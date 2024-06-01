import { cn } from "@/lib/utils/format";
import { createTag, getGuildOrThrow, getTag, updateTag } from "@akashi/db";
import {
	type CommandContext,
	Declare,
	Options,
	SubCommand,
	createStringOption,
	Middlewares,
	createBooleanOption,
} from "seyfert";
import Fuse from "fuse.js";

const editOptions = {
	name: createStringOption({
		description: "Name of the tag",
		required: true,
		autocomplete: async (interaction) => {
			const focus = interaction.getInput();
			const { tags } = await getGuildOrThrow(
				interaction.guildId as string,
				() => new Error("No guild found"),
			);

			return interaction.respond(
				focus.length === 0
					? tags.map((t) => ({ name: t.name, value: t.name })).slice(0, 25)
					: new Fuse(tags, { keys: ["name", "content"] })
							.search(focus)
							.map(({ item: tag }) => ({
								name: tag.name,
								value: tag.name,
							}))
							.slice(0, 25),
			);
		},
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
			content: cn("Edited tag", name),
		});
	}
}
