import { BaseParser, split, type Context, type IParser } from "tagscript";

/**
 * This parser allows sending files along with message using file url.
 */
export class AttachParser extends BaseParser implements IParser {
	public constructor() {
		super(["attach", "attachments"], false, true);
	}

	public parse(ctx: Context) {
		ctx.response.actions.files = split(ctx.tag.payload!, true);

		return "";
	}
}
