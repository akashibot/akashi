import { createMiddleware } from "seyfert";

export const adminMiddleware = createMiddleware<void>(async (middle) => {
	if (!middle.context.developers.includes(middle.context.author.id)) {
		return middle.stop("Too bad commander! You are not a developer!");
	}

	return middle.next();
});
