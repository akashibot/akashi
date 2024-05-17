import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/tables/*",
	out: "./src/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: "postgres://postgres.ftgannrlwwuexzsanrxb:xL5K48sDrT0J1bh4@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
	},
	verbose: true,
	strict: true,
	migrations: {
		table: "__migrations",
		schema: "public",
	},
});
