import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/zento";

// Disable prefetch for serverless environments and enforce SSL on Supabase
const client = postgres(connectionString, {
  prepare: false,
  ssl: connectionString.includes("supabase.com") ? "require" : undefined,
  max: 5,
});
export const db = drizzle(client, { schema });

// Supabase client initialization for storage & auth support
const supabaseUrl = process.env.SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
