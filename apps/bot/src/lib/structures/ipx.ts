import { ofetch } from "ofetch";
import { RequestMethod } from "seyfert";

export const ipx = ofetch.create({
	baseURL: "http://localhost:8000/ipx",
	method: RequestMethod.Get,
	responseType: "arrayBuffer",
	onRequestError: (ctx) => {
		throw new Error(ctx.error.message);
	},
	onResponseError: (ctx) => {
		throw new Error(ctx.error?.message ?? "Nyooo~! Just wait until next time!");
	},
});
