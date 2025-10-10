import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql", // ✅ correct key instead of "driver"
  dbCredentials: {
    url: process.env.DATABASE_URL!, // ✅ correct field name
  },
  verbose: true,
  strict: true,
} satisfies Config;
