FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm

# Install openssl for Prisma engine on Debian
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
