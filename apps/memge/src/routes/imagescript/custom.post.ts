import { Image, decode } from "imagescript";

export default eventHandler(async (event) => {
	const body = await readBody(event);

	const base = (await $fetch<ArrayBuffer>(body.base, {
		responseType: "arrayBuffer",
	}).then(decode)) as Image;

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
	)) as {
		img: Image;
		x: number;
		y: number;
		resize?: { w?: number; h?: number };
	}[];

	if (images?.length >= 1) {
		images.map((image) =>
			base.composite(
				image.img.resize(
					image.resize?.w || image.img.width,
					image.resize?.h || image.resize?.w || image.img.height,
				),
				image?.x ?? 0,
				image?.y ?? 0,
			),
		);
	}

	return Buffer.from(await base.encode());
});
