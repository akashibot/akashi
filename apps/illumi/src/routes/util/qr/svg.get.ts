import sharp from "sharp";
import { renderSVG } from "uqr";

export default eventHandler(async (event) => {
	const { urlOrText } = getQuery(event) as Record<string, string>;
	const svgQR = renderSVG(urlOrText);

	setHeader(event, "Content-Type", "image/png");

	return sharp(Buffer.from(svgQR)).png().toBuffer();
});
