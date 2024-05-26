import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { schema } from "./tables/schema.ts";

export const client = new Client({
	connectionString: process.env.DATABASE_URL,
});
export const db = drizzle(client, { schema });

export * as drizzle from "drizzle-orm";
export * from "./drivers";

export { schema } from "./tables/schema.ts";
