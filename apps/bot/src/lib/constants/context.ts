import { extendContext } from "seyfert";
import { ipx } from "../structures/ipx";

export const context = extendContext(() => {
	return {
		version: "idk",
		ipx,
	};
});
