import { adminMiddleware } from "./admin.middleware";
import { tokensMiddleware } from "./tokens.middleware";

export default {
	tokens: tokensMiddleware,
	admin: adminMiddleware,
};
