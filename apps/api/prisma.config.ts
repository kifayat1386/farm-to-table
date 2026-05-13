import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  studio: {
    port: 5555,
  },
  migrations: {
    databaseUrl: process.env.DATABASE_URL || "postgresql://farmlive_user:farmlive_password@localhost:5432/farmlive?schema=public",
  }
})
