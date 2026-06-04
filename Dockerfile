FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run db:generate
RUN bun run build
# Create the initial database at build time with absolute path
RUN mkdir -p /app/db && DATABASE_URL="file:/app/db/custom.db" bun run db:push

# Production - use Debian-based node image for OpenSSL compatibility
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Install openssl needed by Prisma
RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl libssl3 sqlite3 && \
    rm -rf /var/lib/apt/lists/*

# Copy built files from standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema and client for runtime DB operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy initial database from builder
COPY --from=builder /app/db/custom.db /app/db-init/custom.db

# Create startup script that copies DB if it doesn't exist and starts server
RUN printf '#!/bin/sh\nset -e\nmkdir -p /app/db\nif [ ! -f /app/db/custom.db ]; then\n  cp /app/db-init/custom.db /app/db/custom.db\n  echo "Database initialized from build image"\nfi\nexec node server.js\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000

CMD ["/bin/sh", "/app/start.sh"]
