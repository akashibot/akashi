import sharp from "sharp";

interface CaptionBody {
	image: string;
	caption: string;
}

export default eventHandler(async (event) => {
	const body = await readBody<CaptionBody>(event);

	const { data: imgBuffer, info: imgMetadata } = await sharp(
		await loadImage(body.image),
	)
		.png()
		.toBuffer({ resolveWithObject: true });

	const captionWidth = imgMetadata.width;
	const captionHeight = imgMetadata.height / 2;

	const base = sharp({
		create: {
			width: captionWidth,
			height: imgMetadata.height + captionHeight,
			channels: 4,
			background: { r: 0, g: 0, b: 0, alpha: 1 },
		},
	});

	const captionBox = sharp({
		create: {
			width: captionWidth,
			height: captionHeight,
			channels: 4,
			background: { r: 255, g: 255, b: 255, alpha: 1 },
		},
	});

	const captionText = sharp({
		text: {
			text: `<span background="white" color="black">${body.caption}</span>`,
			align: "center",
			width: Math.round(captionWidth - 50),
			height: captionHeight - 20, // padding
			rgba: true,
			font: "Impact",
			wrap: "word",
		},
	});

	base.composite([
		{
			input: await captionBox
				.composite([
					{
						input: await captionText.png().toBuffer(),
						gravity: sharp.gravity.center,
					},
				])
				.png()
				.toBuffer(),
			top: 0,
			left: 0,
		},
		{
			input: imgBuffer,
			top: captionHeight,
			left: 0,
		},
	]);

	return base.png().toBuffer();
});
