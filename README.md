# CI/CD Setup

A Node.js application with MySQL database using Docker for CI/CD pipeline.

## Features

- Express.js API
- MySQL database connection
- Docker containerization
- Automated CI/CD with GitHub Actions
- Automated deployment

## Prerequisites

- Node.js 18+
- Docker
- Docker Compose
- MySQL database

## Local Development

1. Clone the repository
2. Copy `.env.example` to `.env` and configure your database settings
3. Run `docker-compose up --build`

## CI/CD Pipeline

The project includes multiple GitHub Actions workflows for different deployment scenarios:

### 1. Main CI/CD Pipeline (`ci.yml`)
- **Triggers**: Push/PR to main branch
- **Build**: Install deps, lint, build Docker image
- **Deploy**: Auto-deploy to configured server via SSH

 #deploy:
    #runs-on: ubuntu-latest
    #needs: build
    #if: github.ref == 'refs/heads/main' && github.event_name == 'push'

    #steps:
    # Option 1: Deploy to remote server via SSH (current setup)
    # - name: Deploy to remote server
    #   uses: appleboy/ssh-action@v1.0.3
    #   with:
    #     host: ${{ secrets.SERVER_HOST }}
    #     username: ${{ secrets.SERVER_USERNAME }}
    #     key: ${{ secrets.SERVER_SSH_KEY }}
    #     port: ${{ secrets.SERVER_PORT || 22 }}
    #     script: |
    #       cd /path/to/your/app
    #
    #       # Pull latest changes if needed (optional)
    #       git pull origin main || true
    #
    #       # Copy environment file if not already present
    #       # cp .env.production .env || true
    #
    #       # Stop existing containers
    #       docker-compose down || true
    #
    #       # Pull latest images
    #       docker-compose pull
    #
    #       # Start services
    #       docker-compose up -d




