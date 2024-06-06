import {
	createRegExp,
	maybe,
	exactly,
	char,
	whitespace,
	oneOrMore,
} from "magic-regexp";

/**
 * `/(https?:\\/\\/)?`
 */
export const httpsRegex = createRegExp(
	maybe(exactly("http", maybe("s"), "://").grouped()),
	char.times.any(),
);

/**
 * `/(https?:\\/\\/)?.*\\.((?:(?:png|gif)|jpg)|jpeg)/`
 */
export const httpsImageRegex = createRegExp(
	maybe(exactly("http", maybe("s"), "://").grouped()),
	char.times.any(),
	".",
	exactly("png").or("gif", "jpg", "tiff", "jpeg").grouped(),
);

/**
 * `\/.*[\s,;:.].*\/`
 */
export const separationRegex = /.*[\s,;:.-_].*/g;

/**
 * /(?:\\s|,)+/g
 */
export const spacesAndCommasRegex = createRegExp(
	oneOrMore(whitespace.or(",")),
	["g"],
);

/**
 * `/\b\d+x\d+\b/`
 */
export const sizeRegex = /\b\d+x\d+\b/g;
