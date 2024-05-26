import { BaseParser, IParser } from "tagscript";

/**
 * Make notes on your tag
 *
 * @example
 * ```yaml
 * {note:I will not be shown on the tag response!}
 * ```
 */
export class NoteParser extends BaseParser implements IParser {
	public constructor() {
		super(["note", "comment"], false, false);
	}

	public async parse() {
		return "";
	}
}
