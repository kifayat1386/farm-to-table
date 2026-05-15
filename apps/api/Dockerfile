FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Install openssl and libc6-compat for Prisma engine on Alpine
RUN apk add --no-cache openssl openssl-dev libc6-compat
