FROM node:22-alpine AS builder
WORKDIR /app

# Install all dependencies required for building Astro.
COPY astro/package*.json ./
RUN npm ci

# Copy the Astro project and build the static pages plus the Node server.
COPY astro/ ./
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Only the built server output is needed at runtime.
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
