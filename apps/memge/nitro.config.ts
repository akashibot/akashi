export default defineNitroConfig({
	srcDir: "src",
	routeRules: {
		"/**": {
			headers: {
				"Content-Type": "image/png",
			},
		},
	},
});
