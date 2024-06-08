import { getUserOrCreate, updateUserOrCreate } from "@akashi/db";
import {
	type CommandContext,
	Declare,
	Group,
	Options,
	SubCommand,
	createNumberOption,
	createUserOption,
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

		const databaseUser = await getUserOrCreate(user.id);

		if (user.bot)
			return ctx.editOrReply({
				content: "User can't be a bot",
			});

		await updateUserOrCreate(user.id, {
			tokens: databaseUser.tokens + amount,
		});

		return ctx.editOrReply({
			content: `Gave ${amount} tokens to ${user.toString()}`,
		});
	}
}
