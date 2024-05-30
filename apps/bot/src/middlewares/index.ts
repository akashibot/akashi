import { adminMiddleware } from "./admin.middleware";
import { tagOwnerMiddleware } from "./tag-owner.middleware";
import { tagUsageMiddleware } from "./tag-usage.middleware";
import { tokensMiddleware } from "./tokens.middleware";

export default {
	Tokens: tokensMiddleware,
	Admin: adminMiddleware,
	TagOwner: tagOwnerMiddleware,
	TagUsage: tagUsageMiddleware,
};
