FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY libs/shared/package.json ./libs/shared/

# Install all dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Build API
RUN npm run build --workspace=apps/api

# Remove dev dependencies
RUN npm prune --omit=dev

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 10000

# Start application
CMD ["node", "dist/apps/api/src/main.js"]
