import { listen } from "listhen";
import { createStorage } from "unstorage";
import { createStorageServer } from "unstorage/server";

const storage = createStorage();
const storageServer = createStorageServer(storage, {
	authorize(req) {
		if (req.type === "read" && req.key.startsWith("AKA:")) {
			throw new Error("Unauthorized Read");
		}
	},
});

listen(storageServer.handle, { port: 5000, tunnel: false });
