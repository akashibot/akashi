import jimp from "jimp-compact";

interface CustomBody {
	base: string;
	images?: {
		url: string;
		w?: number;
		h?: number;
		x?: number;
		y?: number;
	}[];
	texts?: {
		text: string;
		w?: number;
		h?: number;
		x?: number;
		y?: number;
	}[];
}

export default eventHandler(async (event) => {
	const body = await readBody<CustomBody>(event);

	const baseBuffer = await jimp.read(body.base).catch(() => {
		throw createError({
			status: 400,
			statusMessage: "Bad request",
			message: "Invalid base image",
		});
	});

	const font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);

	const images = body.images
		? await Promise.all(
				body.images.map(async (img) => ({
					src: await jimp.read(img.url),
					...img,
				})),
			)
		: [];

	const base = await jimp.read(baseBuffer);

	for (const image of images) {
		base.blit(
			image.src.resize(
				image.w ?? image.src.getWidth(),
				image.h ?? image.src.getHeight(),
			),
			image.x,
			image.y,
		);
	}

	for (const text of body.texts) {
		base.print(font, text.x, text.y, { text: text.text }, text.w);
	}

	return base.getBufferAsync(jimp.MIME_PNG);
});