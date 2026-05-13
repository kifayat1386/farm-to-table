FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# In dev, volume mounting provides everything. We don't need to copy much,
# but we provide a shell script to ensure dependencies are installed.
CMD ["pnpm", "dev"]
