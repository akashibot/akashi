import { RequestMethod } from "seyfert";
import { baseService } from "./base";

export const ipx = baseService.create({
	baseURL: "http://localhost:4000/ipx",
	method: RequestMethod.Get,
	responseType: "arrayBuffer",
});
