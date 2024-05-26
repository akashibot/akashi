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
} from "tagscript";
import { AFetchParser } from "./parsers/afetch";
import { NoteParser } from "./parsers/note";
import { AttachParser } from "./parsers/attach";
import { IPXParser } from "./parsers/ipx";

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
	new StrictVarsParser(), // Mandatory for custom vars yk
);
