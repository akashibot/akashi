import sharp from "sharp";

interface SpeechBalloonBody {
	image: string;
}

export default eventHandler(async (event) => {
	const body = await readBody<SpeechBalloonBody>(event);

	const image = sharp(await loadImage(body.image));
	const imageMetadata = await image.metadata();
	const balloon = sharp(
		await loadImage(
			"https://raw.githubusercontent.com/akashibot/.github/main/assets/templates/z0nqjst12ih61.jpg",
		),
	);

	balloon
		.resize({
			fit: "fill",
			width: imageMetadata.width,
			height: imageMetadata.height,
		})
		.extend({
			top: imageMetadata.height,
			extendWith: "repeat",
		})
		.composite([
			{
				input: await balloon.png().toBuffer(),
				top: 0,
				left: 0,
				animated: true,
			},
			{
				input: await image.png().toBuffer(),
				top: imageMetadata.height,
				left: 0,
				animated: true,
			},
		]);

	if (imageMetadata.format === "gif") {
		setResponseHeader(event, "content-type", "image/gif");

		return balloon.gif().toBuffer();
	}

	return balloon.png().toBuffer();
});
