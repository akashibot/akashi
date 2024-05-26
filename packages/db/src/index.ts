import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { schema } from "./tables/schema.ts";
import { DATABASE_URL } from "./private.ts";

config();

export const client = new Client({
	connectionString: DATABASE_URL,
});
export const db = drizzle(client, { schema });

export * as drizzle from "drizzle-orm";
export * from "./drivers";

export { schema } from "./tables/schema.ts";
