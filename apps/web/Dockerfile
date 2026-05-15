FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

# Install libc6-compat for Next.js SWC support on Alpine
RUN apk add --no-cache libc6-compat
