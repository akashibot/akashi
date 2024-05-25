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
} from "tagscript";
import { AFetchParser } from "./parsers/afetch";

export const interpreter = new Interpreter(
	new RandomParser(),
	new RangeParser(),
	new FiftyFiftyParser(),
	new IfStatementParser(),
	new SliceParser(),
	new JSONVarParser(),
	new IncludesParser(),
	new AFetchParser(),
	new StrictVarsParser(), // Mandatory for custom vars yk
);
