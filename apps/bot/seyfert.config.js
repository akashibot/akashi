// @ts-check
import { config } from "seyfert";

if (!process.env.BOT_TOKEN) {
	throw new Error("BOT_TOKEN must be a valid Discord token");
}

export default config.bot({
	token: process.env.BOT_TOKEN,
	intents: ["Guilds"],
	locations: {
		base: "src",
		output: "dist",
		commands: "commands"
	},
});
