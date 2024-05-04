import { Client, type ParseClient } from "seyfert";

const client = new Client();

client.start();

declare module "seyfert" {
	interface UsingClient extends ParseClient<Client<true>> {}
	// interface UsingClient extends ParseClient<WorkerClient<true>> { }
	// interface UsingClient extends ParseClient<HttpClient> { }
}
