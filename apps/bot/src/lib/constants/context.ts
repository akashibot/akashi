import { extendContext } from "seyfert";
import { ipx } from "../structures/ipx";
import { ofetch } from "ofetch";
import { imageStorage } from "../storage/image";

export const context = extendContext(() => {
	return {
		version: "idk",
		ofetch,
		ipx,
		storage: {
			image: imageStorage,
		},
	};
});
