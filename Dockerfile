FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY libs/shared/package.json ./libs/shared/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build API
RUN npm run build --workspace=apps/api

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built files
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 10000

# Start application
CMD ["node", "dist/main.js"]
