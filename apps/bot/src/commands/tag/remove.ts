import { removeTag } from "@akashi/db";
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
	}),
};

@Declare({
	name: "remove",
	description: "Remove a tag from the guild",
	aliases: ["delete", "rem"],
})
@Options(removeOptions)
@Middlewares(["tagOwner"])
export default class TagRemoveCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof removeOptions>) {
		const { name } = ctx.options;

		const tag = await removeTag(name, ctx.guildId as string);

		return ctx.editOrReply({
			content: `Removed tag ${tag.name}`,
		});
	}
}
