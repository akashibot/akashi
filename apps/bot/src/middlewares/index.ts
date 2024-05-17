import { adminMiddleware } from "./admin.middleware";
import { tokensMiddleware } from "./tokens.middleware";

export const middlewares = {
	tokens: tokensMiddleware,
	admin: adminMiddleware,
};
