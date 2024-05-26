import { translate, langs } from "microsoft-translate-api";

interface TranslateBody {
	text: string;
	from: string | null;
	to: string | string[];
}

export default eventHandler(async (event) => {
	const { text, from, to } = await readBody<TranslateBody>(event);

	const result = await translate(text, from, to);

	return {
		langs: langs.default,
		...result[0],
	};
});
