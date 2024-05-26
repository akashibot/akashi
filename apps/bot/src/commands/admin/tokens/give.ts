import { addUserTokens } from "@akashi/db";
import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	createUserOption,
	createNumberOption,
	Group,
} from "seyfert";

const adminTokensGiveOptions = {
	user: createUserOption({
		description: "User to give tokens to",
		required: true,
	}),
	amount: createNumberOption({
		description: "Amount of tokens to give",
		required: true,
	}),
};

@Declare({
	name: "give",
	description: "Gives tokens to the specified user",
})
@Options(adminTokensGiveOptions)
@Group("tokens")
export default class AdminTokensGiveCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof adminTokensGiveOptions>) {
		const { user, amount } = ctx.options;

		if (user.bot)
			return ctx.editOrReply({
				content: "User can't be a bot",
			});

		await addUserTokens(user.id, amount);

		return ctx.editOrReply({
			content: `Gave ${amount} tokens to ${user.toString()}`,
		});
	}
}
