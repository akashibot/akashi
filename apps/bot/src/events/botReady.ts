import { createEvent } from "seyfert";

export default createEvent({
	data: { once: true, name: "botReady" },
	async run(user, client) {
		client.logger.info(`${user.username} is ready`);
	},
});
