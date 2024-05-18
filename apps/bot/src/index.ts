import "dotenv/config";
import {
	Client,
	type ParseMiddlewares,
	type ParseClient,
	config,
} from "seyfert";
import { context } from "./lib/structures/context";
import { middlewares } from "./middlewares";
import { YunaParser } from "yunaforseyfert";
import { loadConfig } from "c12";
import { InternalRuntimeConfig } from "seyfert/lib/client/base";

const client = new Client({
	context,
	commands: {
		prefix: (msg) => [`<@${msg.client.botId}>`, "a!"],
		argsParser: YunaParser(),
	},
	allowedMentions: {
		parse: [],
	},
	async getRC() {
		const { config: seyfertConfig } = await loadConfig({
			configFile: "../seyfert.config.ts",
		});

		return config.bot(seyfertConfig as InternalRuntimeConfig);
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
