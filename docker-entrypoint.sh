#!/bin/sh
# Docker entrypoint script for injecting environment variables into config

# Check if AUTH_PASSWORD is set
if [ -z "$AUTH_PASSWORD" ]; then
    echo "ERROR: AUTH_PASSWORD environment variable is not set!"
    echo "Please set AUTH_PASSWORD in your .env file or docker-compose.yml"
    exit 1
fi

# Create config.json from environment variables
cat > /usr/share/nginx/html/config.json <<EOF
{
  "auth": {
    "password": "${AUTH_PASSWORD}"
  }
}
EOF

echo "Config generated successfully from environment variables"

# Start nginx
exec nginx -g 'daemon off;'
