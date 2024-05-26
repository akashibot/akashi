import { extendContext } from "seyfert";
import * as services from "./services";
import { interpreter } from "./services/tag-parsers";

export const context = extendContext(() => {
	return {
		developers: [
			"1076700780175831100", // @simxnet
			"462780441594822687", // @chikof
		],
		services,
		tags: {
			interpreter,
		},
	};
});
