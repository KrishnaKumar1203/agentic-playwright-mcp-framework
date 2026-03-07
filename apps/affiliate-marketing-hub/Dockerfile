# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy the entire project
COPY . .

# Install dependencies
RUN npm install

# Build the application
WORKDIR /app/apps/affiliate-marketing-hub
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/apps/affiliate-marketing-hub/.next ./.next
COPY --from=builder /app/apps/affiliate-marketing-hub/node_modules ./node_modules
COPY --from=builder /app/apps/affiliate-marketing-hub/package.json ./package.json
COPY --from=builder /app/apps/affiliate-marketing-hub/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the application
CMD ["npm", "start"]
