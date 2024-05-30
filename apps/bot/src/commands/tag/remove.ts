import { getGuildOrThrow, removeTag } from "@akashi/db";
import {
	type CommandContext,
	Declare,
	Options,
	SubCommand,
	createStringOption,
	Middlewares,
} from "seyfert";

const removeOptions = {
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
};

@Declare({
	name: "remove",
	description: "Remove a tag from the guild",
	aliases: ["delete", "rem"],
})
@Options(removeOptions)
@Middlewares(["TagOwner"])
export default class TagRemoveCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof removeOptions>) {
		const { name } = ctx.options;

		const tag = await removeTag(name, ctx.guildId as string);

		return ctx.editOrReply({
			content: `Removed tag ${tag.name}`,
		});
	}
}
