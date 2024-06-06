import { defaultUserTokens } from "@/lib/constants/variables";
import { cnl } from "@/lib/utils/format";
import { type CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "tutorial",
	description: "Learn how to use Akashi image commands",
})
export default class TutorialImageCommand extends SubCommand {
	public async run(ctx: CommandContext) {
		return ctx.editOrReply({
			content: cnl(
				"# Akashi Image Tutorial",
				"Quickly learn how to use Akashi image commands, it's so easy!",
				`1. First, you have to know that image commands use tokens for them to work! You initially start with ${defaultUserTokens} tokens, there is no way to obtain tokens paying for them, you can only get them by voting, waiting or asking \`@simxnet\` for tokens :P`,
				"2. `reformat`, `tutorial` and `metadata` commands won't use any tokens!",
				"3. `raw` command uses 10 tokens, `raw` command is made with the purpose of chaining image operations at once, that's why it uses 10 tokens!",
				"4. The rest of image commands (invert, etc...) use 5 tokens.",
			),
			flags: MessageFlags.Ephemeral,
		});
	}
}
