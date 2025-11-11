FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY server.js ./

# Create directories for cache and data
RUN mkdir -p /app/cache /app/data

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
