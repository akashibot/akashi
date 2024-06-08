import { getGuildOrThrow, getTagOrThrow } from "@akashi/db";
import Fuse from "fuse.js";
import { md } from "mdbox";
import {
	AttachmentBuilder,
	type CommandContext,
	Declare,
	Middlewares,
	Options,
	SubCommand,
	createBooleanOption,
	createStringOption,
} from "seyfert";
import { IntegerTransformer, StringTransformer } from "tagscript";

const getOptions = {
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
@Middlewares(["TagUsage"])
export default class TagGetCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof getOptions>) {
		const { name, raw, args } = ctx.options;

		const tag = await getTagOrThrow(
			name,
			ctx.guildId as string,
			() => new Error("Couldn't find that tag"),
		);

		const parsedTag = await ctx.tags.interpreter.run(tag.content, {
			args: new StringTransformer(args ?? ""),
			argslen: new IntegerTransformer(`${args?.length ?? 0}`),
		});

		const hasContent =
			(parsedTag.body && parsedTag.body.length > 0) ||
			!!parsedTag.actions.files ||
			!!parsedTag.actions.embed;

		if (raw) {
			const author = await ctx.client.users.fetch(tag.author.id);

			return ctx.editOrReply({
				content: `${md.codeBlock(
					parsedTag.raw,
				)}\n\nOwned by: ${author.toString()} (\`${author.id}\`)\nUses: ${
					tag.uses
				}`,
			});
		}

		if (hasContent) {
			const files: AttachmentBuilder[] = [];

			for (const file of parsedTag.actions.files ?? []) {
				files.push(new AttachmentBuilder().setFile("url", file));
			}

			return ctx.editOrReply({
				content: parsedTag.body ?? null,
				files,
				embeds: parsedTag.actions.embed ? [parsedTag.actions.embed] : undefined,
			});
		}

		throw new Error("Tag had no content to show");
	}
}
