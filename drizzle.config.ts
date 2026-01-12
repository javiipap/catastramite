
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/drizzle/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './sqlite.db',
  },
} satisfies Config;
