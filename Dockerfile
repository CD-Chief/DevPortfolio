# Pinned base image so builds are reproducible
FROM node:22.15.0-alpine AS builder
WORKDIR /app

# Install all dependencies required for building Astro.
COPY astro/package*.json ./
RUN npm ci

# Copy the Astro project, build the pages and Node server, then drop dev dependencies.
COPY astro/ ./
RUN npm run build && npm prune --omit=dev

FROM node:22.15.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Only the built server output and runtime dependencies are needed.
COPY --from=builder --chown=node:node /app/dist ./dist
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json

# Run as the unprivileged user that ships with the node image.
USER node

EXPOSE 4321

# Uses Node instead of curl, since the Alpine runtime doesn't ship curl.
# The error handler makes a connection failure count as unhealthy.
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:' + (process.env.PORT || 4321) + '/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "./dist/server/entry.mjs"]
