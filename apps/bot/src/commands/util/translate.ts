import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	createStringOption,
	Embed,
} from "seyfert";
import { TranslationResult } from "../../lib/types/common";
import { md } from "mdbox";
import { spacesAndCommasRegex } from "../../lib/constants/regexes";

const translateOptions = {
	text: createStringOption({
		description: "Text to translate",
		required: true,
	}),
	to: createStringOption({
		description: "Language to translate to (add multiple separating by commas)",
		required: true,
	}),
	from: createStringOption({
		description: "Language to translate from (leave in blank to autodetect)",
		required: false,
	}),
};

@Declare({
	name: "translate",
	description: "Translate a text",
})
@Options(translateOptions)
export default class UtilTranslateCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof translateOptions>) {
		const { text, to, from } = ctx.options;
		const formattedTarget = to.trim().split(spacesAndCommasRegex);

		const { translations, detectedLanguage, langs } =
			await ctx.services.porter<TranslationResult>("/translate", {
				body: {
					text,
					to: formattedTarget,
					from,
				},
			});

		const translationEmbed = new Embed()
			.setTitle(
				`Translated from ${detectedLanguage?.language ?? from} to ${to}`,
			)
			.addFields(
				{
					name: "Original",
					value: md.codeBlock(text),
				},
				...translations.map((t) => ({
					name: langs[t.to],
					value: md.codeBlock(t.text),
				})),
			);

		return ctx.editOrReply({
			content: "👌 Translated",
			embeds: [translationEmbed],
		});
	}
}
