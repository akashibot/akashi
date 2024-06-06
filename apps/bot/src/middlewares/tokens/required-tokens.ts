import { getUserOrCreate, updateUserOrCreate } from "@akashi/db";
import { createMiddleware } from "seyfert";

export const requiredTokensMiddleware = createMiddleware<void>(
	async (middle) => {
		const user = await getUserOrCreate(middle.context.author.id);
		const requiredTokens = middle.context.command.props.requiredTokens ?? 0;

		if (user.tokens < requiredTokens) {
			const neededTokens = requiredTokens - user.tokens;
			return middle.stop(
				`Too bad commander! You ran out of tokens and you need ${neededTokens} more tokens to use this command!\nBut no worries you can still vote for Akashi on [dlist.gg](https://dlist.gg/bot/1236303484861812736) or [dbots.fun](https://dbots.fun) to get **200** tokens for free!`,
			);
		}

		await updateUserOrCreate(user.id, {
			tokens: user.tokens - requiredTokens,
		});

		return middle.next();
	},
);
