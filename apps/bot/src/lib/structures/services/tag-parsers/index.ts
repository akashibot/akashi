import {
	BreakParser,
	DefineParser,
	FiftyFiftyParser,
	IfStatementParser,
	IncludesParser,
	Interpreter,
	JSONVarParser,
	LooseVarsParser,
	RandomParser,
	RangeParser,
	SliceParser,
	StrictVarsParser,
	StringFormatParser,
} from "tagscript";

import { AFetchParser } from "./parsers/afetch";
import { AttachParser } from "./parsers/attach";
import { EmbedParser } from "./parsers/embed";
import { IPXParser } from "./parsers/ipx";
import { NoteParser } from "./parsers/note";

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
