import { extendContext } from "seyfert";
import { ipx } from "../structures/ipx";
import { imageStorage } from "../storage/image";
import { memge } from "../structures/memge";

export const context = extendContext(() => {
	return {
		developers: [
			"1076700780175831100", // @simxnet
			"462780441594822687", // @chikof
		],
		ipx,
		memge,
		storage: {
			image: imageStorage,
		},
	};
});
