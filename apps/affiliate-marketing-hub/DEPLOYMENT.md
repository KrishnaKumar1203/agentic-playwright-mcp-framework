# Affiliate Marketing Hub - DevOps Deployment Guide

## Overview

The Affiliate Marketing Hub is a Next.js application that can be easily deployed using the agent-dev-ops. This guide shows you how to containerize and deploy the application.

## Docker Build with DevOps Agent

### Step 1: Build the Docker Image

```json
{
  "docker": {
    "action": "build",
    "imageName": "affiliate-marketing-hub",
    "tags": ["latest", "v1.0.0"],
    "dockerfile": "Dockerfile",
    "registry": "docker.io/yourusername"
  }
}
```

### Step 2: Run Locally

```json
{
  "docker": {
    "action": "run",
    "imageName": "affiliate-marketing-hub",
    "containerName": "affiliate-hub-local",
    "ports": ["3000:3000"],
    "env": {
      "NODE_ENV": "production",
      "NEXT_PUBLIC_API_URL": "http://localhost:3000/api"
    }
  }
}
```

### Step 3: Push to Registry

```json
{
  "docker": {
    "action": "push",
    "imageName": "affiliate-marketing-hub",
    "tags": ["latest", "v1.0.0"],
    "registry": "docker.io/yourusername"
  }
}
```

## CI/CD Pipeline with Jenkins

### Step 1: Trigger Build Pipeline

```json
{
  "jenkins": {
    "action": "trigger",
    "jobName": "build-affiliate-hub",
    "parameters": {
      "BRANCH": "main",
      "VERSION": "1.0.0"
    },
    "waitForCompletion": true
  }
}
```

### Step 2: Trigger Deployment

```json
{
  "jenkins": {
    "action": "trigger",
    "jobName": "deploy-affiliate-hub",
    "parameters": {
      "ENVIRONMENT": "staging",
      "VERSION": "1.0.0"
    },
    "waitForCompletion": true
  }
}
```

## Git Integration

### Commit Changes

```json
{
  "git": {
    "action": "commit",
    "message": "Deploy Affiliate Marketing Hub v1.0.0",
    "repo": "https://github.com/KrishnaKumar1203/agentic-playwright-mcp-framework.git",
    "branch": "main"
  }
}
```

### Push to Repository

```json
{
  "git": {
    "action": "push",
    "repo": "https://github.com/KrishnaKumar1203/agentic-playwright-mcp-framework.git",
    "branch": "main"
  }
}
```

## Complete Deployment Workflow

Here's a complete workflow using the agent-dev-ops:

```json
{
  "pipeline": {
    "name": "deploy-affiliate-marketing-hub",
    "steps": [
      {
        "stage": "Build",
        "tool": "docker",
        "commands": [
          {
            "action": "build",
            "imageName": "affiliate-marketing-hub",
            "tags": ["latest", "v1.0.0"]
          }
        ]
      },
      {
        "stage": "Push",
        "tool": "docker",
        "commands": [
          {
            "action": "push",
            "imageName": "affiliate-marketing-hub",
            "tags": ["latest", "v1.0.0"],
            "registry": "docker.io/yourusername"
          }
        ]
      },
      {
        "stage": "Test",
        "tool": "postman",
        "commands": [
          {
            "action": "run",
            "collectionFile": "tests/affiliate-hub.postman_collection.json"
          }
        ]
      },
      {
        "stage": "Deploy to Staging",
        "tool": "jenkins",
        "commands": [
          {
            "action": "trigger",
            "jobName": "deploy-affiliate-hub",
            "parameters": {
              "ENVIRONMENT": "staging",
              "VERSION": "1.0.0"
            }
          }
        ]
      },
      {
        "stage": "Deploy to Production",
        "tool": "jenkins",
        "commands": [
          {
            "action": "trigger",
            "jobName": "deploy-affiliate-hub",
            "parameters": {
              "ENVIRONMENT": "production",
              "VERSION": "1.0.0"
            }
          }
        ]
      }
    ]
  }
}
```

## Environment Setup

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_APP_NAME=AffiliateHub
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NODE_ENV=development
```

For production, set these in your deployment environment:

```env
NEXT_PUBLIC_APP_NAME=AffiliateHub
NEXT_PUBLIC_API_URL=https://api.affiliatehub.com
NODE_ENV=production
```

## Health Checks

The Docker image includes a health check:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
```

## Monitoring & Logs

### View Live Logs

```json
{
  "docker": {
    "action": "logs",
    "containerName": "affiliate-hub-prod"
  }
}
```

### Get Container Status

```json
{
  "docker": {
    "action": "health",
    "containerName": "affiliate-hub-prod"
  }
}
```

## Scaling

For production deployment, use Docker Compose:

```yaml
version: '3.8'

services:
  affiliate-hub:
    image: yourusername/affiliate-marketing-hub:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.affiliatehub.com
    restart: always
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"]
      interval: 30s
      timeout: 3s
      retries: 3
      start_period: 40s
```

## Troubleshooting

### Build Fails

Check Docker logs:
```bash
docker logs affiliate-hub-build
```

### Container Won't Start

Verify environment variables and logs:
```bash
docker run -it yourusername/affiliate-marketing-hub:latest
```

### Port Already in Use

Change the port mapping:
```json
{
  "docker": {
    "action": "run",
    "ports": ["3001:3000"]
  }
}
```

## Version Management

Tag releases appropriately:

```json
{
  "docker": {
    "action": "build",
    "imageName": "affiliate-marketing-hub",
    "tags": ["latest", "v1.0.0", "stable"]
  }
}
```

## Support

For more information on using the agent-dev-ops, see:
- [Agent DevOps Documentation](../../packages/agent-dev-ops/README.md)
- [System Design Guide](../../SYSTEM-DESIGN.md)
- [Quick Reference](../../QUICK_REFERENCE.md)

---

**Last Updated**: March 7, 2026  
**Version**: 1.0.0
