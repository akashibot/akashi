import { listen } from "listhen";
import { createApp, defineEventHandler, toNodeListener } from "h3";
import {
	createIPX,
	ipxFSStorage,
	ipxHttpStorage,
	createIPXH3Handler,
} from "ipx";
import { readPackageJSON } from "pkg-types";
import sharp from "sharp";

const ipx = createIPX({
	storage: ipxFSStorage({ dir: "./public" }),
	httpStorage: ipxHttpStorage({ allowAllDomains: true }),
	sharpOptions: {
		animated: true,
	},
});

const app = createApp();

app.use("/ipx", createIPXH3Handler(ipx));
app.use(
	"/stats",
	defineEventHandler(async () => {
		return sharp.counters();
	}),
);
app.use(
	"/",
	defineEventHandler(async () => {
		const localPackageJson = await readPackageJSON();
		return {
			name: localPackageJson.name,
			version: localPackageJson.version,
			description: localPackageJson.description,
			author: localPackageJson.author,
		};
	}),
);

sharp.queue.on("change", (l) => {
	console.log(`${l} tasks queued`);
});

listen(toNodeListener(app), { port: 4000 });
