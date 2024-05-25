import {
	type CommandContext,
	Declare,
	SubCommand,
	Options,
	createStringOption,
	Embed,
} from "seyfert";
import { WhoisResult } from "../../lib/types/api";
import { md } from "mdbox";

const whoisOptions = {
	domain: createStringOption({
		description: "Domain name",
		required: true,
	}),
	whois: createStringOption({
		description: "Whois type",
		required: true,
		choices: [
			{
				name: "Live",
				value: "live",
			},
			{
				name: "Reverse",
				value: "reverse",
			},
			{
				name: "Historical",
				value: "historical",
			},
		],
	}),
};

@Declare({
	name: "whois",
	description: "Lookup a domain",
})
@Options(whoisOptions)
export default class UtilWhoisCommand extends SubCommand {
	public async run(ctx: CommandContext<typeof whoisOptions>) {
		const { domain, whois } = ctx.options;

		const data = await ctx.services.porter<WhoisResult>("/whois", {
			body: {
				domainName: domain,
				whois,
			},
		});

		const translationEmbed = new Embed()
			.setTitle(data.domain_name)
			.setDescription(
				md.codeBlock(
					Object.entries(data)
						.map(([name, value]) => `${name}: ${JSON.stringify(value)}`)
						.slice(0, 2)
						.join("\n"),
				),
			);

		return ctx.editOrReply({
			embeds: [translationEmbed],
		});
	}
}
