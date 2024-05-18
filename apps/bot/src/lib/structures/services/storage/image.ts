import { createStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";

export const imageStorage = createStorage({
	driver: httpDriver({
		base: "http://localhost:5000",
	}),
});
