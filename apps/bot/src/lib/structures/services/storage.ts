import { createStorage } from "unstorage";
import httpDriver from "unstorage/drivers/http";

export const image = createStorage().mount(
	"image",
	httpDriver({
		base: "http://localhost:5000",
	}),
);
