export default {
	token: process.env.BOT_TOKEN,
	intents: ["Guilds", "MessageContent", "GuildMessages"],
	locations: {
		base: "src",
		output: "dist",
		commands: "commands",
		events: "events",
	},
};
