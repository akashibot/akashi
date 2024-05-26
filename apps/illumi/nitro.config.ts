export default defineNitroConfig({
	srcDir: "src",
	routeRules: {
		"/meme/**": {
			headers: {
				"Content-Type": "image/png",
			},
		},
	},
	devStorage: {
		cache: {
			driver: "http",
			base: "http://localhost:5000",
		},
	},
});
