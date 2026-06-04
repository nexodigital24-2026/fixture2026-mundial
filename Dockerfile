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
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built files from standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy prisma schema for runtime DB operations
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy necessary node_modules for runtime
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/@mapbox/node-pre-gyp ./node_modules/@mapbox/node-pre-gyp
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Create db directory with proper permissions
RUN mkdir -p /app/db && chown -R nextjs:nodejs /app/db

# Create startup script
COPY --from=builder /app/package.json ./package.json
RUN echo '#!/bin/sh\nset -e\nmkdir -p /app/db\nnpx prisma db push --skip-generate 2>/dev/null || bunx prisma db push --skip-generate 2>/dev/null || true\nexec node server.js\n' > /app/start.sh && chmod +x /app/start.sh && chown nextjs:nodejs /app/start.sh

USER nextjs

EXPOSE 3000

CMD ["/bin/sh", "/app/start.sh"]
