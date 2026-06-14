// backend/prisma.config.ts
import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'src/security/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});