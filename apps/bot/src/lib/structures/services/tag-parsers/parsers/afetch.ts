import { ofetch } from "ofetch";
import { BaseParser, IParser, Context, SafeObjectTransformer } from "tagscript";

/**
 * Custom parser to fetch data from a URL.
 *
 * @todo Support plain texts
 *
 * @example
 * ```yaml
 * {afetch(data):https://example.com/data}
 * ```
 */
export class AFetchParser extends BaseParser implements IParser {
	public constructor() {
		super(["afetch", "fetch", "http"], true, true);
	}

	public async parse(ctx: Context) {
		const data = await ofetch(ctx.tag.payload, {
			responseType: "json",
		});

		ctx.response.variables[ctx.tag.parameter! ?? "data"] =
			new SafeObjectTransformer(data);

		return "";
	}
}
