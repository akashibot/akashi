import { getTagOrThrow, updateTag } from "@akashi/db";
import { createMiddleware } from "seyfert";

export const tagUsageMiddleware = createMiddleware<void>(async (middle) => {
	if (!middle.context.isChat()) return;
	const tagName = middle.context.resolver.getString("name", true);

	const tag = await getTagOrThrow(
		tagName,
		middle.context.guildId!,
		() => new Error("Tag not found"),
	);

	await updateTag(tag.name, tag.guildId, {
		uses: tag.uses + 1,
	});

	middle.next();
});
