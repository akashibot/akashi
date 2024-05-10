import { extendContext } from "seyfert";
import { imageApiFetch } from "../structures/image-api";

export const context = extendContext(() => {
	return {
		version: "idk",
		imageApi: imageApiFetch,
	};
});
