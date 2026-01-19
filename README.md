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

The project includes a GitHub Actions workflow that:

1. **Build**: Installs dependencies, runs linting, builds Docker image
2. **Test**: Runs tests (when implemented)
3. **Deploy**: Deploys to production server via SSH

### Required GitHub Secrets

Set these secrets in your GitHub repository settings:

- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password/token
- `SERVER_HOST`: Production server IP or domain
- `SERVER_USERNAME`: SSH username for the server
- `SERVER_SSH_KEY`: Private SSH key for server access
- `SERVER_PORT`: SSH port (optional, defaults to 22)

### Deployment Setup

1. **Server Requirements**:
   - Ubuntu/Debian server with Docker and Docker Compose installed
   - SSH access configured
   - Git repository cloned at `/path/to/your/app`

2. **Environment Setup**:
   - Create `.env` file on server with production database credentials
   - Ensure database is accessible from the server

3. **Initial Setup** (run once on server):
   ```bash
   cd /path/to/your/app
   git clone https://github.com/yourusername/ci-cd-setup.git .
   cp .env.example .env
   # Edit .env with production values
   docker-compose up -d
   ```

4. **The deployment script will**:
   - Pull latest code changes
   - Stop existing containers
   - Pull latest Docker images
   - Start services with new code

## Environment Variables

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-database-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
```

## API Endpoints

- `GET /health` - Health check endpoint