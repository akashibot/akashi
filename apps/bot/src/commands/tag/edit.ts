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
				tags
					.filter((tag) => tag.name.includes(focus))
					.map((tag) => ({
						name: tag.name,
						value: tag.name,
					}))
					.slice(0, 10),
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
