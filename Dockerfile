# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 2: Builder / Production
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
COPY docs ./docs

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/v1/health || exit 1

CMD ["node", "src/server.js"]
