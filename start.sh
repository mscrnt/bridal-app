#!/bin/bash

# Wedding Party Website - Quick Start Script

echo "===================================="
echo "  Wedding Party Website"
echo "===================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    echo "Please install Docker Compose"
    exit 1
fi

echo "Building Docker image..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "Error: Failed to build Docker image"
    exit 1
fi

echo ""
echo "Starting container..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Error: Failed to start container"
    exit 1
fi

echo ""
echo "===================================="
echo "  Website is now running!"
echo "===================================="
echo ""
echo "Open your browser and navigate to:"
echo "  http://localhost:8080"
echo ""
echo "To stop the website, run:"
echo "  docker-compose down"
echo ""
echo "To view logs, run:"
echo "  docker-compose logs -f"
echo ""
