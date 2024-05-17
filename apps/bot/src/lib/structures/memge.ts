import { ofetch } from "ofetch";
import { RequestMethod } from "seyfert";

export const memge = ofetch.create({
	baseURL: "http://localhost:9000/imagescript",
	method: RequestMethod.Post,
	responseType: "arrayBuffer",
	onRequestError: (ctx) => {
		throw new Error(ctx.error.message);
	},
});
