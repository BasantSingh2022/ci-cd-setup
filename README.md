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


==================for multiple node version ci-cd-pipeline code===========================
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
    tags: ['v*.*.*']
  pull_request:
    branches: [ main, develop ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run lint
        run: npm run lint

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/nodejs-mysql-app:latest

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Run containers (CI test only)
        run: |
          export DOCKER_USERNAME=${{ secrets.DOCKER_USERNAME }}
          docker compose up -d
          sleep 20
          docker compose ps





