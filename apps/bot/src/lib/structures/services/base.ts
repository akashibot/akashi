import { ofetch } from "ofetch";

export const baseService = ofetch.create({
	onRequestError: (ctx) => {
		throw new Error(ctx.error.message);
	},
	headers: {
		"User-Agent": process.env.USER_AGENT ?? "Unknown",
	},
});
