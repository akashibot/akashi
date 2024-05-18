import "dotenv/config";
import { Client, type ParseMiddlewares, type ParseClient } from "seyfert";
import { context } from "./lib/structures/context";
import { middlewares } from "./middlewares";
import { YunaParser } from "yunaforseyfert";

const client = new Client({
	context,
	commands: {
		prefix: (msg) => [`<@${msg.client.botId}>`, "a!"],
		argsParser: YunaParser(),
	},
	allowedMentions: {
		parse: [],
	},
});

client.setServices({
	middlewares,
});
client.start().then(() => client.uploadCommands());

declare module "seyfert" {
	interface UsingClient extends ParseClient<Client<true>> {}
	interface ExtendContext extends ReturnType<typeof context> {}
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof middlewares> {}
}
