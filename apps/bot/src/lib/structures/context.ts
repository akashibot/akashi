import { extendContext } from "seyfert";
import { ipx } from "./services/ipx";
import * as storages from "./services/storage";
import { illumi } from "./services/illumi";
import { interpreter } from "./services/tag-parsers";

export const context = extendContext(() => {
	return {
		developers: [
			"1076700780175831100", // @simxnet
			"462780441594822687", // @chikof
		],
		services: {
			ipx,
			illumi,
			storages,
		},
		tags: {
			interpreter,
		},
	};
});
