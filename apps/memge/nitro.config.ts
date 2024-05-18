export default defineNitroConfig({
	srcDir: "src",
	routeRules: {
		"/memge/**": {
			headers: {
				"Content-Type": "image/png",
			},
		},
	},
	devStorage: {
		cache: {
		  driver: 'http',
		  base: "http://localhost:5000"
		}
	  },
	prerender: {
		failOnError: true,
	},
});
