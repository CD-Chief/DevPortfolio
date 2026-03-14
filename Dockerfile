FROM node:22-alpine AS builder
WORKDIR /app

# Install all dependencies required for building Astro.
COPY astro/package*.json ./
RUN npm ci

# Copy the Astro project and build static output.
COPY astro/ ./
RUN npm run build

FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
