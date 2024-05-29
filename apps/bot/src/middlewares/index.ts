import { adminMiddleware } from "./admin.middleware";
import { tagOwnerMiddleware } from "./tag-owner.middleware";
import { tokensMiddleware } from "./tokens.middleware";

export default {
	tokens: tokensMiddleware,
	admin: adminMiddleware,
	tagOwner: tagOwnerMiddleware,
};
