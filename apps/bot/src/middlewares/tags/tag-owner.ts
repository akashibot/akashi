import { getTagOrThrow } from "@akashi/db";
import { createMiddleware } from "seyfert";

export const tagOwnerMiddleware = createMiddleware<void>(async (middle) => {
	if (!middle.context.isChat()) return;
	const tagName = middle.context.resolver.getString("name", true);

	const tag = await getTagOrThrow(
		tagName,
		middle.context.guildId!,
		() => new Error("Tag not found"),
	);

	if (middle.context.author.id === tag.userId) return middle.next();

	middle.stop("You do not own this tag");
});
