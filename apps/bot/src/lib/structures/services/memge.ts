import { RequestMethod } from "seyfert";
import { baseService } from "./base";

export const memge = baseService.create({
	baseURL: "http://localhost:1000/memge",
	method: RequestMethod.Post,
	responseType: "arrayBuffer",
});
