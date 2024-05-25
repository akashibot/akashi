import { RuntimeConfig } from "seyfert/lib/client/base";

export default {
	token: process.env.BOT_TOKEN as string,
	intents: ["GuildMembers", "Guilds", "MessageContent", "GuildMessages"],
	locations: {
		base: "src",
		output: "dist",
		commands: "commands",
		events: "events",
	},
} satisfies RuntimeConfig;
