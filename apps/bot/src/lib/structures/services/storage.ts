import { createStorage, prefixStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";

export const storage = createStorage({
	driver: httpDriver({
		base: "http://localhost:5000",
	}),
});

export const image = prefixStorage(storage, "internal:images");
