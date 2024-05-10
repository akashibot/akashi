import { Client, type ParseClient } from "seyfert";
import { context } from "./lib/constants/context";

const client = new Client({
	context,
});

client.start().then(() => client.uploadCommands());

declare module "seyfert" {
	interface UsingClient extends ParseClient<Client<true>> {}
	interface ExtendContext extends ReturnType<typeof context> {}
}
