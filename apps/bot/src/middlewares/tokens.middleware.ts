import { createMiddleware } from "seyfert";
import { getUserOrCreate, removeUserTokens } from "../lib/database/user";

// The generic type tells the middleware what information it will pass to the command
export const tokensMiddleware = createMiddleware<void>(async (middle) => {
	const user = await getUserOrCreate(middle.context.author.id);

	if (user.tokens < 5)
		middle.stop(
			`You need ${
				5 - user.tokens
			} more tokens in order to use this image command.`,
		);
	else {
		await removeUserTokens(user.id, 5);
		middle.next();
	}
});
