import { createMiddleware } from "seyfert";
import {
	getUserOrCreate,
	removeUserTokens,
} from "../lib/structures/services/database/user";

export const tokensMiddleware = createMiddleware<void>(async (middle) => {
	const user = await getUserOrCreate(middle.context.author.id);

	if (user.tokens < 5) {
		const neededTokens = 5 - user.tokens;
		return middle.stop(
			`Too bad commander! You ran out of tokens and you need ${neededTokens} more tokens to use this command!\nBut no worries you can still vote for Akashi on [dlist.gg](https://dlist.gg/bot/1236303484861812736) on [dbots.fun](https://dbots.fun) to get **200** tokens for free!`,
		);
	}

	await removeUserTokens(user.id, 5);
	return middle.next();
});
