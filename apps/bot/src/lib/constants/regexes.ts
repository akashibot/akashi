import {
	createRegExp,
	maybe,
	exactly,
	char,
	whitespace,
	oneOrMore,
} from "magic-regexp";

/**
 * /(https?:\\/\\/)?
 */
export const httpsRegex = createRegExp(
	maybe(exactly("http", maybe("s"), "://").grouped()),
	char.times.any(),
);

/**
 * /(https?:\\/\\/)?.*\\.((?:(?:png|gif)|jpg)|jpeg)/
 */
export const httpsImageRegex = createRegExp(
	httpsRegex.source,
	".",
	exactly("png").or("gif", "jpg", "tiff", "jpeg").grouped(),
);

/**
 * /(?:\\s|,)+/g
 */
export const spacesAndCommasRegex = createRegExp(
	oneOrMore(whitespace.or(",")),
	["g"],
);
