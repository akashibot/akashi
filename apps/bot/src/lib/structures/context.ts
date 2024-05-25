import { extendContext } from "seyfert";
import { ipx } from "./services/ipx";
import * as storages from "./services/storage";
import { memge } from "./services/memge";
import { porter } from "./services/porter";
import { interpreter } from "./services/tag-parsers";

export const context = extendContext(() => {
	return {
		developers: [
			"1076700780175831100", // @simxnet
			"462780441594822687", // @chikof
		],
		services: {
			ipx,
			memge,
			porter,
			storages,
		},
		tags: {
			interpreter,
		},
	};
});
