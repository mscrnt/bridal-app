# Use official Nginx image as base
FROM nginx:alpine

# Install Node.js and npm for building SCSS
RUN apk add --no-cache nodejs npm

# Create build directory
WORKDIR /build

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy SCSS source files
COPY public/scss ./public/scss

# Build SCSS to CSS (both main and auth)
RUN npm run scss:prod

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy our website files to nginx html directory
COPY public/ /usr/share/nginx/html/

# Copy built CSS files from build directory
RUN cp -r /build/public/css /usr/share/nginx/html/css

# Clean up build dependencies
RUN apk del nodejs npm && \
    rm -rf /build

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script to inject config from environment variables
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Use entrypoint to generate config.json from environment variables
ENTRYPOINT ["/docker-entrypoint.sh"]
