import { createEvent } from "seyfert";
import { client as dbClient } from "@akashi/db";

export default createEvent({
	data: { once: true, name: "botReady" },
	async run(user, client) {
		await dbClient
			.connect()
			.then(() => client.logger.info("Connected database"));
		client.logger.info(`${user.username} is ready`);
	},
});
