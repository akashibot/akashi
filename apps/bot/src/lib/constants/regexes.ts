import { createRegExp, maybe, exactly, char } from "magic-regexp";

export const httpsRegex = createRegExp(
	maybe(exactly("http", maybe("s"), "://").grouped()),
	char.times.any(),
);

export const httpsImageRegex = createRegExp(
	maybe(exactly("http", maybe("s"), "://").grouped()),
	char.times.any(),
	".",
	exactly("png").or("gif").or("jpg").or("jpeg").grouped(),
);
