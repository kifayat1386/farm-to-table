FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Install openssl for Prisma engine
RUN apk add --no-cache openssl
