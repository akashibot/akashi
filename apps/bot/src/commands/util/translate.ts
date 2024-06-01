import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	createStringOption,
	Embed,
} from "seyfert";
import { md } from "mdbox";
import { separationRegex } from "@/lib/constants/regexes";

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
		const formattedTarget = to
			.trim()
			.toLowerCase()
			.replace(`"`, "")
			.split(separationRegex);

		const { translations, detectedLanguage, langs } =
			await ctx.services.illumi.util<TranslationResult>("/translate", {
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

interface TranslationResult {
	langs: {
		[key: string]: string;
	};
	translations: {
		text: string;
		to: string;
		sentLen?: {
			srcSentLen: number[];
			transSentLen: number[];
		};
		transliteration?: {
			script: string;
			text: string;
		};
		alignment?: object;
	}[];
	detectedLanguage?: {
		language: string;
		score: number;
	};
}
