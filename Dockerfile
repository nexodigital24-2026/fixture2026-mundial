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

# Production
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy built files from standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema and client for runtime DB operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs

# Copy package.json for prisma db push
COPY --from=builder /app/package.json ./package.json

# Create db directory
RUN mkdir -p /app/db

# Create startup script that initializes DB and starts server
RUN printf '#!/bin/sh\nset -e\nmkdir -p /app/db\nif [ -f /app/node_modules/.bin/prisma ]; then\n  /app/node_modules/.bin/prisma db push --skip-generate 2>/dev/null || true\nfi\nexec node server.js\n' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 3000

CMD ["/bin/sh", "/app/start.sh"]
