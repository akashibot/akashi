import {
	type CommandContext,
	Declare,
	Options,
	SubCommand,
	createStringOption,
	createBooleanOption,
} from "seyfert";
import { getTag } from "../../lib/structures/services/database";
import { md } from "mdbox";
import { StringTransformer } from "tagscript";
import { send } from "../../lib/utils";

const getOptions = {
	name: createStringOption({
		description: "Name of the tag",
		required: true,
	}),
	args: createStringOption({
		description: "Extra args for the tag, if needed",
		required: false,
	}),
	raw: createBooleanOption({
		description: "Show the raw tag",
		required: false,
	}),
};

@Declare({
	name: "get",
	description: "Visualize a tag already parser",
	aliases: ["view"],
})
@Options(getOptions)
export default class TagGetCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof getOptions>) {
		const { name, raw, args } = ctx.options;

		const tag = await getTag(name, ctx.guildId as string, true);

		const parsedTag = await ctx.tags.interpreter.run(tag.content, {
			args: new StringTransformer(args ?? ""),
		});

		if (raw) {
			const author = await ctx.client.users.fetch(tag.author.id);
			return ctx.editOrReply({
				content: `${md.codeBlock(
					parsedTag.raw,
				)}\n\nOwned by: ${author.toString()} (\`${author.id}\`)`,
			});
		}

		if (parsedTag.body)
			return ctx.editOrReply({
				content: parsedTag.body,
			});

		return send(ctx, {
			content: "Tag had no content to show",
			variant: "err",
		});
	}
}
