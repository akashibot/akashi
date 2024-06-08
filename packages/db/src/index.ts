import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { databaseUrl } from "./config.ts";
import { schema } from "./tables/schema.ts";

export const client = new Pool({
	connectionString: databaseUrl,
});
export const db = drizzle(client, { schema });

export { schema } from "./tables/schema.ts";
export * as drizzle from "drizzle-orm";
export * from "./drivers";
