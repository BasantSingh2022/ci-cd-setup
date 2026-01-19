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



