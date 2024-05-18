import { extendContext } from "seyfert";
import { ipx } from "../structures/ipx";
import { imageStorage } from "../storage/image";
import { memge } from "../structures/memge";
import { porter } from "../structures/porter";

export const context = extendContext(() => {
	return {
		developers: [
			"1076700780175831100", // @simxnet
			"462780441594822687", // @chikof
		],
		ipx,
		memge,
		porter,
		storage: {
			image: imageStorage,
		},
	};
});
