import { ofetch } from "ofetch";
import { RequestMethod } from "seyfert";

export const porter = ofetch.create({
	baseURL: "http://localhost:2000",
	method: RequestMethod.Post,
	responseType: "json",
	onRequestError: (ctx) => {
		throw new Error(ctx.error.message);
	},
});
