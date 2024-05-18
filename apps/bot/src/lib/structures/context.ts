import { extendContext } from "seyfert";
import { ipx } from "./services/ipx";
import { imageStorage } from "./services/storage/image";
import { memge } from "./services/memge";
import { porter } from "./services/porter";

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
