import { extendContext } from "seyfert";
import { ipx } from "../structures/ipx";
import { imageStorage } from "../storage/image";
import { memge } from "../structures/memge";

export const context = extendContext(() => {
	return {
		ipx,
		memge,
		storage: {
			image: imageStorage,
		},
	};
});
