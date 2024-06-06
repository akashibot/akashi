import { adminMiddleware } from "./misc/admin";
import { tagOwnerMiddleware } from "./tags/tag-owner";
import { tagUsageMiddleware } from "./tags/tag-uses";
import { requiredTokensMiddleware } from "./tokens/required-tokens";

export default {
	RequiredTokens: requiredTokensMiddleware,
	Admin: adminMiddleware,
	TagOwner: tagOwnerMiddleware,
	TagUsage: tagUsageMiddleware,
};
