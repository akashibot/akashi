import {
	Interpreter,
	RandomParser,
	RangeParser,
	FiftyFiftyParser,
	IfStatementParser,
	SliceParser,
	JSONVarParser,
	IncludesParser,
	StrictVarsParser,
	LooseVarsParser,
	DefineParser,
	StringFormatParser,
	BreakParser,
} from "tagscript";

import { AFetchParser } from "./parsers/afetch";
import { NoteParser } from "./parsers/note";
import { AttachParser } from "./parsers/attach";
import { IPXParser } from "./parsers/ipx";
import { EmbedParser } from "./parsers/embed";

export const interpreter = new Interpreter(
	new RandomParser(),
	new RangeParser(),
	new FiftyFiftyParser(),
	new IfStatementParser(),
	new SliceParser(),
	new JSONVarParser(),
	new IncludesParser(),
	new AFetchParser(),
	new NoteParser(),
	new LooseVarsParser(),
	new DefineParser(),
	new AttachParser(),
	new IPXParser(),
	new EmbedParser(),
	new StringFormatParser(),
	new BreakParser(),
	new StrictVarsParser(), // Mandatory for custom vars yk
);
