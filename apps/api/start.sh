#!/bin/sh

# Install dependencies if they are missing
pnpm install

# Generate Prisma Client
pnpm exec prisma generate

# Apply migrations
# Wait for DB to be ready, then run push or migrate
# Using db push for dev environments since it creates db if it doesn't exist and applies schema
npx prisma db push --accept-data-loss

# Start NestJS in dev mode
pnpm run start:dev
