import { ofetch } from "ofetch";
import { RequestMethod } from "seyfert";

export const imageApiFetch = ofetch.create({
	baseURL: "http://localhost:4000/image",
	method: RequestMethod.Post,
	responseType: "arrayBuffer",
});
