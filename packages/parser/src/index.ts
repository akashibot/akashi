import {
	Parser,
	Lexer,
	PrefixedStrategy,
	ParserResult,
} from "@sapphire/lexure";

type CommandOption = {
	name: string;
};

export const parser = new Parser(new PrefixedStrategy(["--", "/"], ["=", ":"]));
export const lexer = new Lexer({
	quotes: [
		['"', '"'],
		["“", "”"],
		["「", "」"],
	],
});

export function parseContent(content: string): ParserResult {
	return parser.run(lexer.run(content));
}

export function getOption(content: ParserResult, name: string) {
	return content.options.get(name) ?? [];
}

export function getOrdered(
	content: ParserResult,
	commandOptions: CommandOption[],
) {
	const ordered = content.ordered;

	// get command options that match ordered and commandOptions index
	const options = commandOptions.map((_, index) => {
		const option = ordered[index];
		return option?.value ?? null;
	});

	return options;
}

export function getOptions(
	content: ParserResult,
	commandOptions: CommandOption[],
) {
	const opts: Record<string, string> = {};

	for (const { name } of commandOptions) {
		const optionValues = getOption(content, name);

		if (optionValues.length > 0) {
			// Use the value from the options map if it exists
			opts[name] = optionValues[0];
		} else {
			// Otherwise, try to get the value from the ordered content
			const orderedValues = getOrdered(content, commandOptions);
			for (let i = 0; i < orderedValues.length; i++) {
				if (orderedValues[i] !== null) {
					opts[commandOptions[i].name] = orderedValues[i] as string;
				}
			}
		}
	}

	// console.log(opts);

	return opts;
}
