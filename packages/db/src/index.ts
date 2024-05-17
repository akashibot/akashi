import { Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const client = new Client({
	connectionString:
		"postgres://postgres.ftgannrlwwuexzsanrxb:xL5K48sDrT0J1bh4@aws-0-eu-central-1.pooler.supabase.com:5432/postgres",
});

export * as drizzle from "drizzle-orm";
export * as schemas from "./schema";
export const db = drizzle(client, { schema });
