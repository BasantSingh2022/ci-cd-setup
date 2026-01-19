#!/bin/bash

# GitHub Secrets Setup Script
# Run this locally to generate SSH keys and display setup instructions

echo "=== GitHub Actions Secrets Setup ==="
echo ""

# Generate SSH key for server deployment
echo "1. Generating SSH key for server deployment..."
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key -N ""

echo ""
echo "=== Copy these values to GitHub Secrets ==="
echo ""

echo "DOCKER_USERNAME=your_dockerhub_username"
echo "DOCKER_PASSWORD=your_dockerhub_token"
echo ""

echo "SERVER_HOST=your_server_ip_or_domain"
echo "SERVER_USERNAME=your_server_username"
echo "SERVER_PORT=22"
echo ""

echo "SERVER_SSH_KEY<<EOF"
cat ~/.ssh/github_deploy_key
echo "EOF"

echo ""
echo "=== Server Setup Instructions ==="
echo ""
echo "1. Copy the public key to your server:"
echo "   ssh-copy-id -i ~/.ssh/github_deploy_key.pub user@your-server"
echo ""
echo "2. On your server, ensure Docker and Docker Compose are installed"
echo ""
echo "3. Clone your repository and set up the environment:"
echo "   git clone https://github.com/yourusername/ci-cd-setup.git /path/to/app"
echo "   cd /path/to/app"
echo "   cp .env.example .env"
echo "   # Edit .env with production database settings"
echo ""
echo "4. Test the deployment manually:"
echo "   docker-compose up -d"

echo ""
echo "=== GitHub Repository Setup ==="
echo ""
echo "Go to: https://github.com/yourusername/ci-cd-setup/settings/secrets/actions"
echo "Add the secrets listed above"
echo ""
echo "Then push to main branch to trigger automatic deployment!"