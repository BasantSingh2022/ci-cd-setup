#!/bin/bash

# Docker cleanup and restart script for CI/CD failures
# Usage: ./cleanup-restart.sh

set -e

echo "=== Docker Cleanup and Restart Script ==="

# Function to cleanup containers
cleanup_containers() {
    echo "Cleaning up existing containers..."
    docker compose down --remove-orphans || true
    docker system prune -f || true
    docker volume prune -f || true
    echo "Cleanup completed."
}

# Function to restart containers
restart_containers() {
    echo "Starting containers..."
    export DOCKER_USERNAME=${{ secrets.DOCKER_USERNAME }}
    
    # Start containers
    docker compose up -d
    
    # Wait for database to be healthy
    echo "Waiting for database to be healthy..."
    timeout 60 bash -c 'until docker compose ps db | grep -q "healthy"; do sleep 5; done'
    
    # Wait for app to be healthy
    echo "Waiting for app to be healthy..."
    timeout 60 bash -c 'until docker compose ps app | grep -q "healthy\|Up"; do sleep 5; done'
    
    echo "Containers started successfully."
    docker compose ps
}

# Function to check container health
check_health() {
    echo "Checking container health..."
    
    # Check app container
    if docker compose ps app | grep -q "Up"; then
        echo "✅ App container is running"
    else
        echo "❌ App container is not running"
        docker compose logs app --tail=20
        return 1
    fi
    
    # Check database
    if docker compose ps db | grep -q "healthy"; then
        echo "✅ Database is healthy"
    else
        echo "❌ Database is not healthy"
        docker compose logs db --tail=20
        return 1
    fi
    
    return 0
}

# Main execution
main() {
    cleanup_containers
    
    # Try to start containers
    if restart_containers; then
        # Check health after startup
        if check_health; then
            echo "✅ All containers are running and healthy!"
            exit 0
        else
            echo "❌ Health check failed, attempting cleanup and retry..."
            cleanup_containers
            sleep 5
            restart_containers
            
            if check_health; then
                echo "✅ Recovery successful!"
                exit 0
            else
                echo "❌ Recovery failed. Manual intervention required."
                exit 1
            fi
        fi
    else
        echo "❌ Failed to start containers"
        exit 1
    fi
}

# Run main function
main "$@"
