import Jimp from "jimp-compact";

interface SpeechBalloonBody {
	image: string;
}

export default eventHandler(async (event) => {
	const body = await readBody<SpeechBalloonBody>(event);

	const image = await Jimp.read(body.image);
	const balloon = await Jimp.read(
		"https://raw.githubusercontent.com/akashibot/.github/main/assets/templates/z0nqjst12ih61.jpg",
	);

	balloon.resize(image.getWidth(), image.getHeight());

	const base = new Jimp(
		image.getWidth(),
		balloon.getHeight() + image.getHeight(),
		0x000000ff,
	);

	base.composite(balloon, 0, 0);
	base.composite(image, 0, balloon.getHeight());

	// const used = process.memoryUsage();
	// console.log("------- JIMP COMPACT -------");
	// for (const key in used) {
	// 	console.log(
	// 		`Memory: ${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`,
	// 	);
	// }
	// console.log("------- JIMP COMPACT -------");

	return base.getBufferAsync(Jimp.MIME_PNG);
});
