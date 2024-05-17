import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
	entryPoints: ["src/**/*.ts"],
	clean: true,
	format: ["cjs"],
	watch: true,
	...options,
}));
