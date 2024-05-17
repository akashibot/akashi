import { extendContext } from "seyfert";
import { ipx } from "../structures/ipx";
import { ofetch } from "ofetch";
import { imageStorage } from "../storage/image";
import { memge } from "../structures/memge";

export const context = extendContext(() => {
	return {
		version: "idk",
		ofetch,
		ipx,
		memge,
		storage: {
			image: imageStorage,
		},
	};
});
