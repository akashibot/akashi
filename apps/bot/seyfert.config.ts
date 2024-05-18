import { InternalRuntimeConfig } from "seyfert/lib/client/base";

export default {
	token: process.env.BOT_TOKEN as string,
	intents: 513,
	locations: {
		base: "src",
		output: "dist",
		commands: "commands",
		events: "events",
	},
} satisfies InternalRuntimeConfig;
