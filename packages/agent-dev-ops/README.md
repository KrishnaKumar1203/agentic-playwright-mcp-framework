# agent-dev-ops

## DevOps & Development Expert Agent

A comprehensive, intelligent DevOps agent that automates development operations, handles containerization, CI/CD pipelines, and infrastructure management. Expert in Docker, Jenkins, Git, Postman, and modern DevOps tools.

## Features

✅ **Docker Operations** - Build, run, push, deploy containerized applications  
✅ **Jenkins Integration** - Trigger builds, manage pipelines, retrieve logs  
✅ **Git Version Control** - Clone, commit, push, pull, branch, merge operations  
✅ **Postman Testing** - Run collections, test APIs, export data  
✅ **CI/CD Pipeline Management** - Orchestrate multi-stage pipelines  
✅ **Container Orchestration** - Manage Docker Compose and Kubernetes  
✅ **Infrastructure Automation** - Deploy and manage infrastructure  
✅ **Intelligent Tool Selection** - Automatically uses appropriate tools for tasks  
✅ **Best Practices** - Provides recommendations for each operation  
✅ **Error Recovery** - Built-in retry logic and error handling  

## Input Format

### Docker Operations
```json
{
  "docker": {
    "action": "build|run|push|deploy|compose",
    "imageName": "my-app",
    "tags": ["latest", "v1.0.0"],
    "dockerfile": "Dockerfile",
    "containerName": "my-container",
    "ports": ["8080:8080", "5432:5432"],
    "volumes": ["/data:/app/data"],
    "env": {
      "NODE_ENV": "production",
      "DEBUG": "false"
    },
    "registry": "docker.io/myusername"
  }
}
```

### Jenkins Operations
```json
{
  "jenkins": {
    "action": "trigger|status|build|pipeline|logs",
    "jobName": "build-pipeline",
    "buildNumber": 42,
    "parameters": {
      "BRANCH": "main",
      "ENVIRONMENT": "staging"
    },
    "waitForCompletion": true
  }
}
```

### Git Operations
```json
{
  "git": {
    "action": "clone|commit|push|pull|branch|merge|log",
    "repo": "https://github.com/user/repo.git",
    "message": "Add new feature",
    "branch": "feature/new-feature",
    "remoteBranch": "origin/main",
    "localPath": "./local-repo"
  }
}
```

### Postman Operations
```json
{
  "postman": {
    "action": "run|test|export|import|lint",
    "collectionFile": "collection.json",
    "environment": "production",
    "resultsPath": "results/postman-results.json"
  }
}
```

### CI/CD Pipeline
```json
{
  "pipeline": {
    "name": "deploy-production",
    "steps": [
      {
        "stage": "Build",
        "tool": "docker",
        "commands": ["build", "push"]
      },
      {
        "stage": "Test",
        "tool": "postman",
        "commands": ["run-tests"]
      },
      {
        "stage": "Deploy",
        "tool": "jenkins",
        "commands": ["deploy-prod"]
      }
    ]
  }
}
```

## Output Format

```json
{
  "success": true,
  "operationType": "docker-build",
  "results": {
    "status": "completed",
    "output": "Building Docker image: my-app\nDockerfile: Dockerfile\nTags: -t my-app:latest -t my-app:v1.0.0\n✓ Build queued successfully",
    "details": {
      "action": "build",
      "image": "my-app",
      "tags": ["latest", "v1.0.0"],
      "timestamp": "2024-01-15T10:30:00Z"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  },
  "artifacts": [
    {
      "type": "docker-image",
      "path": "docker://my-app:latest"
    }
  ],
  "recommendations": [
    "Use .dockerignore to optimize build context",
    "Implement multi-stage builds for smaller images",
    "Scan images for vulnerabilities before push"
  ]
}
```

## Supported Operations

### Docker
- **build** - Build Docker images from Dockerfile
- **run** - Run containers with port and volume mappings
- **push** - Push images to registry (Docker Hub, ECR, GCR)
- **pull** - Pull images from registry
- **deploy** - Deploy containers to production
- **compose** - Manage multi-container applications with Docker Compose
- **stop** - Stop running containers
- **health** - Check container health status

### Jenkins
- **trigger** - Trigger Jenkins job with parameters
- **status** - Get current build status
- **build** - Execute build pipeline
- **pipeline** - Manage multi-stage pipelines
- **logs** - Retrieve build logs
- **artifact** - Download build artifacts

### Git
- **clone** - Clone repository
- **commit** - Commit changes with message
- **push** - Push changes to remote
- **pull** - Pull latest changes
- **branch** - Create/switch branches
- **merge** - Merge branches with conflict resolution
- **tag** - Create version tags
- **log** - View commit history

### Postman
- **run** - Run Postman collection
- **test** - Run API tests with assertions
- **export** - Export collection as JSON
- **import** - Import external collections
- **lint** - Lint collection for issues

## Integration Points

- **Inputs From**: agent-codegen (test requirements), agent-qa-gate (quality metrics)
- **Outputs To**: agent-report-composer (deployment status), agent-test-coverage (test results)
- **Dependencies**: Dockerode SDK, simple-git, Axios for HTTP
- **Configuration**: Via environment variables (DOCKER_HOST, JENKINS_URL, GIT_PATH, POSTMAN_API_KEY)

## Smart Capabilities

### Intelligent Tool Selection
The agent automatically identifies which tool to use based on:
- Operation type (build → Docker, test → Postman)
- Technology stack (Node → npm, Java → Maven)
- Environment requirements (dev → local Docker, prod → Kubernetes)

### Error Recovery
- Automatic retry with exponential backoff
- Fallback strategies for tool failures
- Graceful degradation when tools unavailable

### Best Practices Integration
Each operation includes:
- Security recommendations (vulnerability scanning)
- Performance optimizations (caching, parallel builds)
- Reliability patterns (health checks, rolling deployments)
- Monitoring suggestions (logging, metrics collection)

## Use Cases

1. **Complete CI/CD Pipeline** - Build → Test → Deploy automation
2. **Containerization** - Docker image creation and registry management
3. **Version Control** - Automated git operations and branch management
4. **API Testing** - Postman collection execution and validation
5. **Infrastructure as Code** - Infrastructure deployment automation
6. **Multi-environment Deployments** - Dev/QA/UAT/PROD pipeline orchestration

## Environment Variables

```bash
DOCKER_HOST=unix:///var/run/docker.sock     # Docker daemon socket
JENKINS_URL=http://localhost:8080           # Jenkins server URL
JENKINS_USER=admin                          # Jenkins username
JENKINS_TOKEN=your-api-token                # Jenkins API token
GIT_PATH=/usr/bin/git                       # Git binary path
POSTMAN_API_KEY=your-postman-key            # Postman API key
```

## Dependencies

- **dockerode** (^4.0.2) - Docker API client
- **simple-git** (^3.20.0) - Git operations wrapper
- **axios** (^1.6.2) - HTTP client for Jenkins/Postman
- **uuid** (^9.0.1) - Unique identifier generation

## Layer

**Layer 8: Infrastructure & DevOps**  
Part of the 7-layer architecture, specialized for infrastructure operations and deployment automation.

## Example Usage

### Build and Deploy Docker Image
```json
{
  "docker": {
    "action": "build",
    "imageName": "myapp",
    "tags": ["latest", "1.0.0"],
    "dockerfile": "Dockerfile"
  }
}
```

### Trigger Jenkins Pipeline
```json
{
  "jenkins": {
    "action": "trigger",
    "jobName": "deploy-production",
    "parameters": {
      "BRANCH": "main",
      "VERSION": "1.0.0"
    },
    "waitForCompletion": true
  }
}
```

### Git Commit and Push
```json
{
  "git": {
    "action": "commit",
    "message": "Release version 1.0.0",
    "repo": "https://github.com/user/repo.git",
    "branch": "main"
  }
}
```

## Status

✅ **Ready for Production**  
✅ **Comprehensive DevOps Automation**  
✅ **Smart Tool Integration**  
✅ **Production-Grade Error Handling**

---

**Version**: 1.0.0  
**Created**: March 7, 2026  
**Layer**: 8 (Infrastructure & DevOps)  
**Status**: Active
