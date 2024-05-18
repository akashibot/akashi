import { RequestMethod } from "seyfert";
import { baseService } from "./base";

export const porter = baseService.create({
	baseURL: "http://localhost:2000",
	method: RequestMethod.Post,
	responseType: "json",
});
