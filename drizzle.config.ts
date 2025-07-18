import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://admin:tulatidodb@tulatido.marceloremeseiro.com:55006/defaultdb',
  },
} satisfies Config; 