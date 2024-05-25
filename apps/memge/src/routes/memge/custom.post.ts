import sharp from "sharp";

interface CustomBody {
	animated?: boolean;
	base: string;
	images?: {
		url: string;
		w?: number;
		h?: number;
		x?: number;
		y?: number;
		text?: {
			text: string;
			w?: number;
			h?: number;
			x?: number;
			y?: number;
		};
	}[];
}

export default eventHandler(async (event) => {
	const body = await readBody<CustomBody>(event);

	const base = sharp(await loadImage(body.base), {
		animated: body.animated ?? false,
	});

	const images = body.images
		? await Promise.all(
				body.images.map(async (img) => ({
					src: await sharp(await loadImage(img.url)).toBuffer(),
					...img,
				})),
			)
		: [];

	// for (const image of images) {
	// 	base.composite(
	// 		image.src.resize(
	// 			image.w ?? image.src.getWidth(),
	// 			image.h ?? image.src.getHeight(),
	// 		),
	// 		image.x,
	// 		image.y,
	// 	);
	// }

	base.composite(
		images.map((image) => ({
			input: image.src,
			left: image.x,
			top: image.y,
			width: image.w,
			height: image.h,
			text: {
				text: image.text?.text,
				left: image.text?.x,
				top: image.text?.y,
				width: image.text?.w,
				height: image.text?.h,
			},
			animated: true,
		})),
	);

	if (body.animated) {
		setResponseHeader(event, "content-type", "image/gif");

		return base.gif().toBuffer();
	}

	return base.png().toBuffer();
});
