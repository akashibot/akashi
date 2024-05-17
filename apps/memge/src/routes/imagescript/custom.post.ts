import { Image, decode } from "imagescript";
import { ImageData, TextData } from "~/types/imagescript";

const fonts = {
	impact:
		"https://github.com/sophilabs/macgifer/raw/master/static/font/impact.ttf",
	comic:
		"https://github.com/sophilabs/macgifer/raw/master/static/font/comic.ttf",
};

export default eventHandler(async (event) => {
	const body = await readBody(event);
	const base = (await $fetch<ArrayBuffer>(body.base, {
		responseType: "arrayBuffer",
	}).then(decode)) as Image;
	const texts = body.texts as TextData[];

	const images = (await Promise.all(
		body.images.map(async (image) => ({
			img: await $fetch<ArrayBuffer>(image.url, {
				responseType: "arrayBuffer",
			}).then(decode),
			x: image.x,
			y: image.y,
			resize: {
				w: image?.resize?.w,
				h: image?.resize?.h,
			},
		})),
	)) as ImageData[];

	if (images?.length >= 1) {
		for (const image of images) {
			base.composite(
				image.img.resize(
					image.resize?.w || image.img.width,
					image.resize?.h || image.resize?.w || image.img.height,
				),
				image?.x ?? 0,
				image?.y ?? 0,
			);
		}
	}

	if (texts?.length >= 1) {
		for (const text of texts) {
			const baseFont = await $fetch<ArrayBuffer>(fonts[text.font ?? "impact"], {
				responseType: "arrayBuffer",
				onRequestError: () => {
					throw new Error("Invalid font provided");
				},
			}).then((x) => new Uint8Array(x));

			base.composite(
				await Image.renderText(
					baseFont,
					text.size ?? 64,
					text.text,
					0x000000ff,
				),
				text?.x ?? 0,
				text?.y ?? 0,
			);
		}
	}

	return Buffer.from(await base.encode());
});
