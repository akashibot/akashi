import "dotenv/config";
import {
	Client,
	type ParseMiddlewares,
	type ParseClient,
	config,
	type RuntimeConfig,
} from "seyfert";
import { context } from "./lib/structures/context";
import middlewares from "./middlewares";
import { YunaParser } from "yunaforseyfert";
import { loadConfig } from "c12";
import { UnstoreAdapter } from "./lib/cache";
import { APIEmbed } from "seyfert/lib/types";

const client = new Client({
	context,
	commands: {
		prefix: (msg) => ["-", "*", `<@${msg.client.botId}>`, "akashi"],
		argsParser: YunaParser({
			logResult: process.env.NODE_ENV === "development",
		}),
		defaults: {
			props: {
				requiredTokens: 0,
			},
		},
	},
	allowedMentions: {
		parse: [],
	},

	async getRC() {
		const { config: seyfertConfig } = await loadConfig({
			configFile: "../seyfert.config.ts",
		});

		return config.bot(seyfertConfig as RuntimeConfig);
	},
});

client.setServices({
	middlewares,
	cache: {
		adapter: new UnstoreAdapter(),
	},
});
client.start().then(() => client.uploadCommands());

declare module "seyfert" {
	interface UsingClient extends ParseClient<Client<true>> {}
	interface ExtendContext extends ReturnType<typeof context> {}
	interface RegisteredMiddlewares
		extends ParseMiddlewares<typeof middlewares> {}
	interface ExtraProps {
		requiredTokens?: number;
	}
}

declare module "tagscript" {
	interface IActions {
		files?: string[];
		embed?: APIEmbed;
	}
}
