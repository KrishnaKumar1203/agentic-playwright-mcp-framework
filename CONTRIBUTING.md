# Contributing to Agentic Playwright MCP Framework

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Commit Conventions](#commit-conventions)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation Standards](#documentation-standards)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful and professional in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/agentic-playwright-mcp-framework.git
   cd agentic-playwright-mcp-framework
   ```

3. **Set up your development environment** (see Development Setup below)
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Git

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   npm run install-all  # Install all workspace packages
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration values
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Verify installation**:
   ```bash
   npm run test
   npm run lint
   ```

## Commit Conventions

We follow the **Conventional Commits** specification for clear, semantic commit messages.

### Commit Message Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type

Must be one of:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation change
- **style**: Code style change (formatting, semicolons, etc.)
- **refactor**: Code refactoring without feature/fix
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates
- **ci**: CI/CD configuration changes
- **mcp**: MCP protocol or agent communication changes

### Scope

The scope specifies what part of the project is affected (optional):
- `agent-ai-planner`
- `agent-test-data`
- `agent-dom-analyzer`
- `agent-self-healing`
- `agent-failure-analyzer`
- `agent-test-coverage`
- `core` (for agents-core)
- `config` (for configuration)
- `test-app` (for example webapp)
- `docs` (for documentation)

### Examples

```
feat(agent-ai-planner): add LLM integration for test plan generation
fix(agent-self-healing): improve selector matching accuracy
docs(README): update architecture diagram
test(agent-test-data): add Faker.js integration tests
refactor(core): simplify agent interface
```

## Pull Request Process

1. **Update your branch** with latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Ensure all tests pass**:
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

3. **Create a descriptive PR** with:
   - Clear title following commit conventions
   - Description of changes and motivation
   - Reference to related issues (use `Fixes #123`)
   - Screenshots/logs if applicable

4. **PR Review Checklist**:
   - [ ] Code follows style guidelines
   - [ ] Tests added/updated for new functionality
   - [ ] No console.error or debug statements left
   - [ ] Documentation updated
   - [ ] No hardcoded values (use environment variables)
   - [ ] Changes don't break existing functionality

5. **After Approval**:
   - Squash commits if requested
   - Merge using "Squash and Merge" or "Rebase and Merge"
   - Delete your feature branch

## Code Style Guidelines

### TypeScript/JavaScript

- **Indentation**: 2 spaces
- **Line Length**: Max 100 characters (documentation can exceed)
- **Semicolons**: Required
- **Quotes**: Single quotes for strings (unless template literals needed)
- **Naming**:
  - Classes: PascalCase (e.g., `AIPlannerAgent`)
  - Functions/variables: camelCase (e.g., `getTestCredentials`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_TIMEOUT`)
  - Private members: prefix with `_` (e.g., `_internalMethod()`)

### File Organization

```
packages/[agent-name]/
├── src/
│   ├── [agent-name].ts      # Main agent implementation
│   └── index.ts              # Public exports
├── package.json
├── tsconfig.json
└── README.md
```

### Imports Organization

```typescript
// 1. External modules
import { faker } from '@faker-js/faker';

// 2. Internal modules
import { Agent } from '@agents/agents-core';

// 3. Local modules
import { ConfigLoader } from './configLoader';
```

## Testing Requirements

- **Test Coverage**: Minimum 80% for new code
- **Test Command**: `npm run test`
- **Test Files**: Extension must be `.spec.ts` or `.test.ts`
- **Naming**: Tests should be descriptive

### Example Test

```typescript
import { describe, test, expect } from '@jest/globals';
import { AIPlannerAgent } from './ai-planner';

describe('AIPlannerAgent', () => {
  test('should generate test cases from requirements', async () => {
    const agent = new AIPlannerAgent();
    const input = {
      userStory: 'User should login',
      requirements: ['Valid credentials', 'Dashboard display'],
    };
    
    const result = await agent.execute(input);
    
    expect(result.status).toBe('success');
    expect(result.result.testCases.length).toBeGreaterThan(0);
  });
});
```

## Documentation Standards

### README for Agents

Each agent package should have README.md with:
- **Purpose**: What the agent does
- **Input Format**: Expected input structure
- **Output Format**: Returned output structure
- **Usage Example**: How to use the agent
- **Dependencies**: External packages used

### Inline Code Documentation

```typescript
/**
 * Analyzes test failures with AI-powered suggestions
 * @param failures - Array of test failure objects
 * @returns Promise<FailureAnalysisOutput>
 */
async execute(input: any): Promise<any>
```

### Update Documentation When

- Adding new agents
- Changing configuration options
- Modifying pipeline flow
- Adding new artifact types
- Updating dependencies

## Security Guidelines

- **Never commit secrets** (use environment variables)
- **Never hardcode credentials** in source files
- **Sanitize user inputs** before using in selectors
- **Use HTTPS** for all API calls
- **Validate all LLM responses** before executing
- **Test timeout values** to prevent infinite loops

## Performance Guidelines

- **Selector timeouts**: 30-60s for CI pipelines
- **Log execution time**: Monitor agent performance
- **Memory usage**: Check for leaks in long-running pipelines
- **Retry logic**: Use exponential backoff with jitter
- **Structured logging**: Use Pino with appropriate levels

## Questions or Need Help?

- Open an **Issue** on GitHub for questions
- Check existing issues/PRs for similar problems
- Start a **Discussion** for feature requests
- Review **Architecture** docs in `SYSTEM-DESIGN.md`

## Recognition

Contributors will be recognized in commit history and release notes.

Thank you for contributing! 🚀