export default defineNitroConfig({
	srcDir: "src",
	routeRules: {
		"/imagescript/**": {
			headers: {
				"Content-Type": "image/png",
			},
		},
	},
	prerender: {
		failOnError: true,
	},
});
