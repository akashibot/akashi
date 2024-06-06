import { createStorage, prefixStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";
import memoryDriver from "unstorage/drivers/memory";

export const storage = createStorage({
	driver:
		process.env.CACHE_DRIVER === "memory"
			? memoryDriver()
			: httpDriver({
					base: "http://localhost:5000",
				}),
});

export const custom = prefixStorage(storage, "internal:custom");
export const image = prefixStorage(storage, "internal:images");
