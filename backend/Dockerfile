# Backend Dockerfile for Car Rental API

# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies for native modules, Sharp, and MongoDB Database Tools
# Sharp requires: vips-dev, build-base, python3
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    vips-dev \
    fftw-dev \
    build-base \
    mongodb-tools

# Stage 2: Dependencies
FROM base AS dependencies
COPY package*.json ./
RUN npm ci --only=production && \
    npm rebuild sharp && \
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

# Create uploads directory
RUN mkdir -p uploads/cars

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start development server
CMD ["npm", "run", "dev"]

# Stage 5: Production
FROM base AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Copy production dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY . .

# Create uploads directory with proper permissions
RUN mkdir -p uploads/cars && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start production server
CMD ["npm", "start"]
