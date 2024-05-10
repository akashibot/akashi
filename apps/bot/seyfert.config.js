// @ts-check
require("dotenv/config");
const { config } = require("seyfert");

if (!process.env.BOT_TOKEN) {
	throw new Error("BOT_TOKEN must be a valid Discord token");
}

module.exports = config.bot({
	token: process.env.BOT_TOKEN,
	intents: ["Guilds"],
	locations: {
		base: "src",
		output: "dist",
		commands: "commands",
	},
});
