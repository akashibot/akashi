import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { schema } from "./tables/schema.ts";

export const client = new Client({
	connectionString:
		"postgres://postgres.ftgannrlwwuexzsanrxb:oFKDE1mGl11ovRaH@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
});
export const db = drizzle(client, { schema });

export * as drizzle from "drizzle-orm";
export * from "./drivers";

export { schema } from "./tables/schema.ts";
