import { listen } from "listhen";
import { createApp, toNodeListener } from "h3";
import {
	createIPX,
	ipxFSStorage,
	ipxHttpStorage,
	createIPXH3Handler,
} from "ipx";

const ipx = createIPX({
	storage: ipxFSStorage({ dir: "./public" }),
	httpStorage: ipxHttpStorage({ allowAllDomains: true }),
	sharpOptions: {
		animated: true,
	},
});

const app = createApp();

app.use("/ipx", createIPXH3Handler(ipx));

listen(toNodeListener(app), { port: 4000 });
