import { BaseParser, type Context, type IParser } from "tagscript";

/**
 * This parser exports IPX API for tags.
 *
 * @example
 * ```yaml
 * {ipx(https://example.com/image.png):negate}
 * ```
 */
export class IPXParser extends BaseParser implements IParser {
	public constructor() {
		super(["ipx"], true, true);
	}

	public async parse(ctx: Context) {
		// TODO: Push to files instead of overwriting them
		ctx.response.actions.files = [
			`http://localhost:4000/ipx/${ctx.tag.payload}/${ctx.tag.parameter}`,
		];

		return "";
	}
}
