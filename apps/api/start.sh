#!/bin/bash

# Remove prisma.config.ts if it exists to prevent TS compilation errors
rm -f /app/apps/api/prisma.config.ts

# Generate Prisma Client
pnpm exec prisma generate

# Apply migrations
# Wait for DB to be ready, then run push or migrate
npx prisma db push --accept-data-loss

# Start NestJS in dev mode
pnpm run start:dev
