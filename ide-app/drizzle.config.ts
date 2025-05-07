import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.MARIADB_USER!,
    password: process.env.MARIADB_PASSWORD!,
    database: process.env.MARIADB_DATABASE!,
  },
});