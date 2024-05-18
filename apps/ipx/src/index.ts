import { listen } from "listhen";
import { createApp, toNodeListener } from "h3";
import {
	createIPX,
	ipxFSStorage,
	ipxHttpStorage,
	createIPXH3Handler,
} from "ipx";
import { readPackageJSON } from "pkg-types";

const ipx = createIPX({
	storage: ipxFSStorage({ dir: "./public" }),
	httpStorage: ipxHttpStorage({ allowAllDomains: true }),
	sharpOptions: {
		animated: true,
	},
});

const app = createApp();

app.use("/ipx", createIPXH3Handler(ipx));
app.use("/", async () => {
	const localPackageJson = await readPackageJSON();
	return {
		name: localPackageJson.name,
		version: localPackageJson.version,
		description: localPackageJson.description,
		author: localPackageJson.author,
	};
});

listen(toNodeListener(app), { port: 4000 });
