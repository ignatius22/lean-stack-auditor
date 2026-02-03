# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files (including tsconfig)
COPY package*.json tsconfig.json ./

# Install all dependencies (dev included) for compilation
RUN npm install

# Copy source code
COPY src/ src/

# Build TypeScript -> JavaScript (dist folder)
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev && npm cache clean --force

EXPOSE 3000

# Start server (using node directly, not tsx)
CMD ["node", "dist/server.js"]
