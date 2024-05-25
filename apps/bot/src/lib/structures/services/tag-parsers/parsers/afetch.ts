import { ResponseType, ofetch } from "ofetch";
import {
	BaseParser,
	IParser,
	Context,
	SafeObjectTransformer,
	StringTransformer,
} from "tagscript";

/**
 * Custom parser to fetch data from a URL.
 *
 * @example
 * {afetch(json):https://example.com/data}
 */
export class AFetchParser extends BaseParser implements IParser {
	public constructor() {
		super(["afetch", "fetch"], true, true);
	}

	public async parse(ctx: Context) {
		const [responseType, varName] = ctx.tag.parameter!.split(",");

		console.log(responseType, varName);

		const data = await ofetch(ctx.tag.payload, {
			responseType: (responseType as ResponseType) ?? "json",
		});

		if (["json"].includes(responseType))
			ctx.response.variables[varName ?? "data"] = new SafeObjectTransformer(
				JSON.stringify(data),
			);
		else
			ctx.response.variables[varName ?? "data"] = new StringTransformer(data);

		return "";
	}
}
