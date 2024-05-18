import { RequestMethod } from "seyfert";
import { baseService } from "./base";

export const memge = baseService.create({
	baseURL: "http://localhost:1000/imagescript",
	method: RequestMethod.Post,
	responseType: "arrayBuffer",
});
