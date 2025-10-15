# Frontend Dockerfile for Car Rental Website

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app

# Stage 2: Dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 3: Development dependencies
FROM base AS dev-dependencies
COPY package*.json ./
RUN npm ci

# Stage 4: Development
FROM base AS development
COPY package*.json ./
COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 5: Build
FROM base AS build
COPY package*.json ./
COPY --from=dev-dependencies /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Stage 6: Production with Nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
