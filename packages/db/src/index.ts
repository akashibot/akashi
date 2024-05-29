import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./tables/schema.ts";
import { Pool } from "pg";
import { databaseUrl } from "./config.ts";

export const client = new Pool({
	connectionString: databaseUrl,
});
export const db = drizzle(client, { schema });

export { schema } from "./tables/schema.ts";
export * as drizzle from "drizzle-orm";
export * from "./drivers";
