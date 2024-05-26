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
	maybe(exactly("http", maybe("s"), "://").grouped()),
	char.times.any(),
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

/**
 * /(?:\\s|,\\.-)+/g
 */
export const spacesAndStuffRegex = createRegExp(
	oneOrMore(whitespace.or(",", ".", "-")),
	["g"],
);

export const discordEmojiRegex = /<a?:.+?:(\d+)?>|\p{Extended_Pictographic}/gu;
