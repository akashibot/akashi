import { ofetch } from "ofetch";
import { RequestMethod } from "seyfert";

export const ipx = ofetch.create({
	baseURL: "http://localhost:8000/ipx",
	method: RequestMethod.Get,
	responseType: "arrayBuffer",
	onRequestError: () => {
		throw new Error("ipx request error");
	},
	onResponseError: () => {
		throw new Error("ipx response error");
	},
});
