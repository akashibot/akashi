import { BaseParser, split, type Context, type IParser } from "tagscript";

/**
 * This parser allows sending files along with message using file url.
 *
 * @example
 * ```yaml
 * {attach:https://example.com/image.png,https://example.com/image2.png}
 * ```
 */
export class AttachParser extends BaseParser implements IParser {
	public constructor() {
		super(["attach", "attachments", "files"], false, true);
	}

	public parse(ctx: Context) {
		ctx.response.actions.files = split(ctx.tag.payload!, true);

		return "";
	}
}
