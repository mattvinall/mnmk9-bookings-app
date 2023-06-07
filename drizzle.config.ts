import type { Config } from "drizzle-kit";

export default {
	schema: "./src/server/db/schema",
	out: "./drizzle",
} satisfies Config;