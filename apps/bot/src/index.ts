import { Client, type ParseMiddlewares, type ParseClient } from "seyfert";
import { context } from "./lib/constants/context";
import { middlewares } from "./middlewares";

const client = new Client({
	context,
	commands: {
		prefix: (msg) => [`<@${msg.client.botId}>`, "a!"],
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
