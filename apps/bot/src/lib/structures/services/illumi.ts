import { RequestMethod } from "seyfert";
import { baseService } from "./base";

export const illumi = {
	meme: baseService.create({
		baseURL: "http://localhost:1000/meme",
		method: RequestMethod.Post,
		responseType: "arrayBuffer",
	}),
	util: baseService.create({
		baseURL: "http://localhost:1000/util",
		method: RequestMethod.Post,
		responseType: "json",
	}),
};
