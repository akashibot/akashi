import { readPackageJSON } from "pkg-types";

export default eventHandler(async () => {
	const localPackageJson = await readPackageJSON();
	return {
		name: localPackageJson.name,
		version: localPackageJson.version,
		description: localPackageJson.description,
		author: localPackageJson.author,
	};
});
