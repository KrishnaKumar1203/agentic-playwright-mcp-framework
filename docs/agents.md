# Agents Documentation

## Overview

The Agentic Playwright MCP Framework consists of **21 specialized agents** organized into a **9-layer agentic architecture**. Each agent has a specific responsibility in the test automation pipeline.

- **Original 12 Agents**: Core framework agents
- **New 6 Agents (Phase 2)**: AI-driven and intelligent agents
- **New 1 Agent (Phase 2.5)**: SQL query validation and safety agent
- **New 2 Agents (Phase 3)**: DevOps and API Gateway agents for infrastructure and API management

## Architecture Layers

```
Layer 9: API Management
├─ agent-api-gateway        (API gateway, routing, caching, testing)
└─ API documentation & monitoring

Layer 8: Infrastructure & DevOps
├─ agent-dev-ops            (Docker, Jenkins, Git, CI/CD pipelines)
└─ Deployment automation

Layer 7: Reporting Layer
├─ agent-report-composer     (Compose comprehensive reports)
└─ agent-test-coverage       (Map tests to requirements)

Layer 6: Intelligence Layer
├─ agent-self-healing        (Auto-fix broken selectors)
└─ agent-failure-analyzer    (AI-powered failure analysis)

Layer 5: Execution Layer
├─ Playwright Test Runner    (Execute tests)
└─ Browser Automation        (Chrome, Firefox, WebKit)

Layer 4: Generation Layer
├─ agent-codegen           (Generate Playwright specs)
├─ agent-sql-query-builder (Validate & generate safe SQL queries - SELECT ONLY)
└─ agent-codemod           (Transform code)

Layer 3: Discovery Layer
├─ agent-explorer          (Find UI elements)
└─ agent-dom-analyzer      (Detect DOM changes)

Layer 2: Planning Layer (AI-Driven)
├─ agent-ai-planner        (LLM-based test planning)
└─ agent-test-data         (Dynamic data generation)

Layer 1: Configuration Layer
├─ Configuration files     (Environment variables, credentials)
└─ Path management         (Artifact directories)
```

## Layer 1: Configuration Layer

No specific agents - infrastructure components that provide configuration context to all other agents.

---

## Layer 2: Planning Layer

### agent-ai-planner ⭐ (NEW - Phase 2)
**Package**: `packages/agent-ai-planner`  
**Purpose**: AI-powered test plan generation from requirements  
**Layer**: 2 - Planning  
**Responsibilities**:
- Read requirements from REQUIREMENTS.md
- Use LLM (OpenAI/Anthropic) to understand requirements
- Generate structured Vendor Specific Test Plans (VSTP)
- Map test cases to requirements
- Create preconditions, steps, and expected results
- Calculate coverage percentage

**Input**: 
```json
{
  "userStory": "User should login with valid credentials",
  "requirements": ["Valid credentials accepted", "Dashboard displayed"],
  "context": {}
}
```

**Output**: `artifacts/vstp/ai-generated-test-plan.json`
```json
{
  "planId": "PLAN-123456",
  "testCases": [
    {
      "id": "TC_001",
      "title": "Verify login with valid credentials",
      "preconditions": ["User is on login page"],
      "steps": ["Enter username", "Enter password", "Click login"],
      "expectedResults": ["User authenticated", "Dashboard displayed"],
      "priority": "HIGH"
    }
  ],
  "coverage": 85
}
```

**Dependencies**: openai, @anthropic-ai/sdk, axios  
**Key Feature**: Eliminates manual test plan creation - requirements → tests automatically

---

### agent-test-data (NEW - Phase 2)
**Package**: `packages/agent-test-data`  
**Purpose**: Dynamic test data generation eliminating hardcoding  
**Layer**: 2 - Planning  
**Responsibilities**:
- Generate realistic test data using Faker.js
- Create edge cases and boundary value data
- Support multiple data types (email, phone, SSN, names, addresses)
- Generate datasets without any hardcoding
- Create custom data patterns

**Input**:
```json
{
  "count": 10,
  "patterns": [
    { "fieldName": "firstName", "type": "name" },
    { "fieldName": "email", "type": "email" },
    { "fieldName": "phone", "type": "phone" }
  ]
}
```

**Output**: `artifacts/test-data/generated-data.json`
```json
{
  "datasets": [
    {
      "firstName": "John",
      "email": "john.doe@example.com",
      "phone": "(555) 123-4567"
    },
    {
      "firstName": "Jane",
      "email": "jane.smith@example.com",
      "phone": "(555) 987-6543"
    }
  ],
  "count": 12
}
```

**Dependencies**: @faker-js/faker, uuid  
**Key Feature**: No more hardcoded testuser1/password123 - dynamic, realistic data

---

## Layer 3: Discovery Layer

### agent-explorer
**Package**: `packages/agent-explorer`  
**Purpose**: Automated UI element discovery  
**Layer**: 3 - Discovery  
**Responsibilities**:
- Navigate application pages
- Discover UI elements (buttons, inputs, links)
- Extract element locators (CSS, XPath, data-testid)
- Classify elements by type
- Generate object repository
- Handle dynamic and shadow DOM elements

**Input**: Application URL, credentials  
**Output**: `artifacts/object-repo/elements.json`  
**Technology**: Playwright inspector, CDP protocol  

---

### agent-dom-analyzer (NEW - Phase 2)
**Package**: `packages/agent-dom-analyzer`  
**Purpose**: Detect and analyze DOM structure changes  
**Layer**: 3 - Discovery  
**Responsibilities**:
- Compare DOM structures between two states
- Identify added/removed/modified elements
- Detect selector stability issues
- Classify changes by severity (critical/major/minor)
- Generate DOM difference reports
- Alert when breaking changes occur

**Input**:
```json
{
  "oldDom": { "elements": [...] },
  "newDom": { "elements": [...] }
}
```

**Output**: `artifacts/dom-diff/changes.json`
```json
{
  "diffs": [
    {
      "type": "removed",
      "element": {"selector": "button.old-login"},
      "severity": "critical"
    }
  ],
  "breakingChanges": 1,
  "warnings": ["CRITICAL: button.old-login was removed"]
}
```

**Dependencies**: cheerio, diff, @playwright/test  
**Key Feature**: Automatic detection of UI changes that break tests

---

## Layer 4: Generation Layer

### agent-codegen
**Package**: `packages/agent-codegen`  
**Purpose**: Generate Playwright test code from specifications  
**Layer**: 4 - Generation  
**Responsibilities**:
- Transform VSTP into Playwright TypeScript code
- Create page object classes
- Generate test fixtures
- Implement BDD step definitions
- Apply code standards and patterns
- Optimize selector strategies

**Input**: VSTP, object repository  
**Output**: `apps/example-webapp-tests/tests/generated/*.spec.ts`  
**Generates**:
- `.spec.ts` test files
- `.pageObject.ts` files
- `.fixture.ts` files
- `.steps.ts` BDD implementations

---

### agent-sql-query-builder (NEW - Phase 2.5) 🔒
**Package**: `packages/agent-sql-query-builder`  
**Purpose**: Safe SQL query validation and generation (SELECT-only)  
**Layer**: 4 - Generation  
**Responsibilities**:
- Validate SQL queries for security (SELECT-only enforcement)
- Block DELETE, INSERT, UPDATE, DROP, CREATE, ALTER commands
- Generate safe SQL queries programmatically
- Detect SQL injection risks and dangerous patterns
- Analyze query performance issues
- Support agent-codegen in generating database queries
- Extract tables and columns from queries

**Input**:
```json
{
  "queries": ["SELECT id, name FROM users WHERE age > 18"],
  "buildRequest": {
    "type": "SELECT",
    "tables": ["users"],
    "columns": ["id", "email"],
    "where": { "status": "active" },
    "limit": 100
  }
}
```

**Output**: `artifacts/sql-queries/validation-report.json`
```json
{
  "validations": [
    {
      "isValid": true,
      "isSafe": true,
      "queryType": "SELECT",
      "riskLevel": "safe",
      "issues": [],
      "tables": ["users"],
      "columns": ["id", "name"],
      "message": "Query is safe to execute"
    }
  ],
  "generatedQueries": ["SELECT id, email FROM users WHERE status = 'active' LIMIT 100"],
  "safeQueryCount": 1,
  "blockedQueryCount": 0
}
```

**Key Features**:
- ✅ **SELECT-Only Enforcement** - Blocks all data modification commands
- ✅ **Security Validation** - Detects SQL injection patterns
- ✅ **Parameterization Warnings** - Alerts on unparameterized queries
- ✅ **Performance Analysis** - Identifies inefficient query patterns
- ✅ **Safe Query Building** - Generates secure queries programmatically
- ✅ **Table/Column Extraction** - Parses query structure

**Blocked Commands**: DELETE, INSERT, UPDATE, DROP, CREATE, ALTER, TRUNCATE, GRANT, REVOKE, EXEC

**Dependencies**: sql-bricks, sql-parser-cst  
**Key Feature**: Ensures all database queries in generated code are read-only and safe

---

### agent-codemod
**Package**: `packages/agent-codemod`  
**Purpose**: Code transformation and refactoring  
**Layer**: 4 - Generation  
**Responsibilities**:
- Apply code transformations
- Refactor generated code
- Update metadata in test files
- Apply linting and formatting standards
- Modernize code patterns
- Update dependencies in generated code

**Input**: Generated test files  
**Output**: Refactored, optimized test files

---

## Layer 5: Execution Layer

### Playwright Test Runner
**Technology**: Playwright 1.40+  
**Purpose**: Execute generated tests  
**Responsibilities**:
- Run .spec.ts test files
- Manage browser contexts and instances
- Capture screenshots on failure
- Record videos and execution traces
- Generate test results JSON
- Manage timeouts and retries

**Browsers**: Chromium, Firefox, WebKit (configurable)  
**Output**: Test results, logs, screenshots, videos, traces

---

## Layer 6: Intelligence Layer

### agent-self-healing (NEW - Phase 2)
**Package**: `packages/agent-self-healing`  
**Purpose**: Automatically fix broken selectors  
**Layer**: 6 - Intelligence  
**Responsibilities**:
- Detect selector failures during test execution
- Use string similarity matching to find alternative selectors
- Analyze DOM for similar elements
- Suggest high-confidence fixes automatically
- Update object repository with healed selectors
- Track healing success rates

**Input**:
```json
{
  "failedSelectors": ["button.old-login"],
  "currentDom": { "elements": [...] }
}
```

**Output**: `artifacts/failure-analysis/healing-suggestions.json`
```json
{
  "healedSelectors": [
    {
      "fixed": true,
      "originalSelector": "button.old-login",
      "newSelector": "button[data-testid='login']",
      "confidence": 0.92
    }
  ],
  "totalHealed": 1
}
```

**Dependencies**: @playwright/test, cheerio, string-similarity  
**Key Feature**: Tests auto-heal when selectors change - no manual updates needed

---

### agent-failure-analyzer (NEW - Phase 2)
**Package**: `packages/agent-failure-analyzer`  
**Purpose**: AI-powered test failure analysis  
**Layer**: 6 - Intelligence  
**Responsibilities**:
- Analyze test failure stack traces
- Use LLM to suggest root causes
- Provide fix recommendations with confidence scores
- Classify failure types (selector, assertion, network, auth, crash)
- Suggest manual investigation steps for low-confidence failures
- Learn from failure patterns over time

**Input**:
```json
{
  "failures": [
    {
      "testName": "login test",
      "error": "Element not found: button.login",
      "stackTrace": "..."
    }
  ]
}
```

**Output**: `artifacts/failure-analysis/analysis-report.json`
```json
{
  "analyses": [
    {
      "testName": "login test",
      "failureReason": "Element not found",
      "errorType": "SELECTOR_TIMEOUT",
      "suggestedFix": "Increase timeout or update selector",
      "confidence": 0.9
    }
  ],
  "autoFixable": 1,
  "requiresManualReview": 0
}
```

**Dependencies**: openai, axios  
**Key Feature**: LLM analyzes failures like debugging with Copilot - suggests fixes automatically

---

## Layer 7: Reporting Layer

### agent-report-composer
**Package**: `packages/agent-report-composer`  
**Purpose**: Comprehensive report generation  
**Layer**: 7 - Reporting  
**Responsibilities**:
- Aggregate all test execution results
- Generate HTML, JSON, JUnit reports
- Create executive summaries
- Produce test failure details
- Generate graphics and trend analysis
- Create database validation reports

**Input**: Test results, artifacts from all stages  
**Output**:
- `artifacts/reports/summary.html` - Executive summary
- `artifacts/reports/detailed.html` - Full test details
- `artifacts/reports/junit.xml` - CI/CD integration
- `artifacts/reports/trends.json` - Historical trends

**Features**: Interactive dashboards, charts, trend graphs

---

### agent-test-coverage (NEW - Phase 2)
**Package**: `packages/agent-test-coverage`  
**Purpose**: Requirements coverage validation  
**Layer**: 7 - Reporting  
**Responsibilities**:
- Map generated tests to original requirements
- Calculate coverage percentage
- Identify missing test cases
- Create traceability matrix
- Report coverage gaps and recommendations
- Validate requirements completeness

**Input**:
```json
{
  "requirements": ["Login should succeed with valid creds", "Error shown with invalid creds"],
  "tests": ["should login with valid credentials", "should show error with invalid creds"]
}
```

**Output**: `artifacts/coverage/coverage-report.json`
```json
{
  "metrics": {
    "totalRequirements": 2,
    "coveredRequirements": 2,
    "coveragePercentage": 100
  },
  "requirements": [
    {
      "requirementId": "REQ_1",
      "requirementText": "Login should succeed...",
      "testsCovering": ["should login with valid credentials"],
      "isCovered": true,
      "confidence": 0.95
    }
  ],
  "gaps": []
}
```

**Key Feature**: Ensures every requirement has a test - full traceability

---

## Layer 8: Infrastructure & DevOps

### agent-dev-ops (NEW - Phase 3)
**Package**: `packages/agent-dev-ops`  
**Purpose**: Comprehensive DevOps and development operations automation  
**Layer**: 8 - Infrastructure & DevOps  
**Responsibilities**:
- Docker image builds, runs, pushes to registries
- Jenkins pipeline triggering and management
- Git operations (clone, commit, push, pull, branch, merge)
- Postman API testing and collection execution
- CI/CD pipeline orchestration
- Container orchestration (Docker Compose, Kubernetes)
- Infrastructure automation and deployment
- Intelligent tool selection based on operation type

**Input**: DevOps operation requests with tool specifications
```json
{
  "docker": {
    "action": "build|run|push|deploy|compose",
    "imageName": "my-app",
    "tags": ["latest", "v1.0.0"],
    "dockerfile": "Dockerfile"
  }
}
```

**Output**: `artifacts/devops/operation-results.json`
```json
{
  "success": true,
  "operationType": "docker-build",
  "results": {
    "status": "completed",
    "action": "build",
    "image": "my-app",
    "tags": ["latest", "v1.0.0"],
    "timestamp": "2024-03-07T10:30:00Z"
  },
  "recommendations": [
    "Use .dockerignore to optimize build context",
    "Implement multi-stage builds for smaller images"
  ]
}
```

**Key Features**:
- ✅ **Docker Operations** - Build, run, push, deploy containers
- ✅ **Jenkins Integration** - Trigger jobs, manage pipelines, retrieve logs
- ✅ **Git Version Control** - Full git workflow automation
- ✅ **Postman Testing** - API collection execution and validation
- ✅ **CI/CD Orchestration** - Multi-stage pipeline management
- ✅ **Container Management** - Docker Compose and Kubernetes support
- ✅ **Best Practices** - Provides recommendations for each operation
- ✅ **Error Recovery** - Automatic retry with exponential backoff

**Supported Operations**:
- Docker: build, run, push, pull, deploy, compose, stop, health
- Jenkins: trigger, status, build, pipeline, logs, artifact
- Git: clone, commit, push, pull, branch, merge, tag, log
- Postman: run, test, export, import, lint

**Dependencies**: dockerode, simple-git, axios, uuid  
**Key Feature**: Automates entire CI/CD pipeline - from code commit to production deployment

---

## Layer 9: API Management

### agent-api-gateway (NEW - Phase 3)
**Package**: `packages/agent-api-gateway`  
**Purpose**: Modern API gateway and management with intelligent routing, caching, and testing  
**Layer**: 9 - API Management  
**Responsibilities**:
- Intelligent API request handling and routing
- Response caching with configurable expiry
- Per-endpoint rate limiting with sliding window
- Multiple authentication methods (Bearer, API Key, OAuth2, Basic)
- Auto-generate Swagger/OpenAPI documentation
- Comprehensive API testing and validation
- Request/response schema validation
- Mock API server creation for testing
- Real-time health and performance monitoring
- API versioning support
- Request/response transformation

**Input**: API request and management operations
```json
{
  "request": {
    "endpoint": "/api/v1/users",
    "method": "GET",
    "headers": { "Accept": "application/json" },
    "auth": {
      "type": "bearer",
      "credentials": "token123"
    }
  }
}
```

**Output**: `artifacts/api-gateway/request-response.json`
```json
{
  "success": true,
  "operationType": "api-request",
  "response": {
    "status": 200,
    "statusText": "OK",
    "body": { "users": [...] },
    "duration": 145,
    "cached": false
  },
  "metrics": {
    "responseTime": 145,
    "statusCode": 200,
    "cacheHit": false,
    "rateLimitRemaining": 99
  }
}
```

**Key Features**:
- ✅ **Intelligent Routing** - Smart request routing and failover
- ✅ **Response Caching** - Automatic caching with HTTP header respect
- ✅ **Rate Limiting** - Sliding window rate limiting per endpoint
- ✅ **Authentication** - Multiple auth methods support
- ✅ **API Documentation** - Auto-generate Swagger/OpenAPI docs
- ✅ **Testing** - Full API test suite execution
- ✅ **Schema Validation** - Request/response validation
- ✅ **Mock APIs** - Create mock servers for testing
- ✅ **Monitoring** - Real-time metrics and health checks
- ✅ **Error Recovery** - Intelligent retry strategies

**Supported Operations**:
- Request: routing, caching, timeout management, retry
- Documentation: Swagger generation, API publishing
- Testing: endpoint testing, assertion validation
- Validation: schema validation, response validation
- Monitoring: health checks, performance metrics, alerting
- Mock: mock server creation, endpoint simulation

**Dependencies**: axios, express, swagger-jsdoc, swagger-ui-express, uuid  
**Key Feature**: Central API gateway with intelligent caching, rate limiting, and comprehensive testing

---

## Original 12 Agents (Core Framework)

### 1. agents-core
**Package**: `packages/agents-core`  
**Purpose**: Base framework and interfaces  
**Key Classes**: Agent (abstract), AgentInput, AgentOutput  

### 2. agent-connector
**Purpose**: Connection and configuration resolution  
**Output**: Connection config for all downstream agents

### 3. agent-login
**Purpose**: Authentication and session management  
**Output**: Auth tokens and session data

### 4. agent-catalog
**Purpose**: Service discovery  
**Output**: `artifacts/catalog/utilities.json` - Business services list

### 5. agent-orchestrator
**Purpose**: Execution planning  
**Output**: Execution plan with stage dependencies

### 6. agent-functional
**Purpose**: Functional test execution  
**Output**: Functional test results

### 7. agent-test-plan
**Purpose**: VSTP generation  
**Output**: `artifacts/vstp/*.vstp.json` - Structured test plans

### 8. agent-qa-gate
**Purpose**: Quality validation  
**Output**: QA gate pass/fail status

### 9. agent-report-composer (See Layer 7 above)

### 10. agent-codemod (See Layer 4 above)

---

## Communication Pattern

All agents follow the MCP protocol for communication:

```typescript
// Input Structure
interface AgentInput {
  taskId: string;
  payload: any;
  metadata?: Record<string, any>;
  timestamp: Date;
}

// Output Structure
interface AgentOutput {
  id: string;
  taskId: string;
  result: any;
  status: 'success' | 'failure' | 'partial';
  error?: Error;
  timestamp: Date;
}
```

---

## Agent Statistics

| Layer | Agents | Purpose |
|-------|--------|---------|
| Layer 1 | - | Configuration (no agents) |
| Layer 2 | 2 | Planning: AI Planner, Test Data Generator |
| Layer 3 | 2 | Discovery: Explorer, DOM Analyzer |
| Layer 4 | 3 | Generation: Codegen, SQL Query Builder, Codemod |
| Layer 5 | 1 | Execution: Playwright runner |
| Layer 6 | 2 | Intelligence: Self-Healing, Failure Analyzer |
| Layer 7 | 2 | Reporting: Report Composer, Coverage Analyzer |
| Layer 8 | 1 | Infrastructure: DevOps Agent |
| Layer 9 | 1 | API Management: API Gateway Agent |
| **Original** | **12** | **Core Framework Agents** |
| **TOTAL** | **21** | **Complete Agent Ecosystem** |

---

## What Each Agent Does - Quick Reference

| Agent | Input | Process | Output |
|-------|-------|---------|--------|
| agent-ai-planner⭐ | Requirements | LLM generates test cases | VSTP JSON |
| agent-test-data⭐ | Data patterns | Faker.js generates realistic data | generated-data.json |
| agent-explorer | App URL | Navigate and find elements | elements.json |
| agent-dom-analyzer⭐ | Old/new DOM | Compare structures | dom-diff/changes.json |
| agent-codegen | VSTP + elements | Generate Playwright code | .spec.ts files |
| agent-sql-query-builder🔒 | SQL queries | Validate & generate safe SELECT only | validation-report.json |
| agent-codemod | .spec.ts files | Refactor and optimize | optimized .spec.ts |
| Playwright | .spec.ts | Run tests in browsers | Test results |
| agent-self-healing⭐ | Failed selectors | Fix using string similarity | healing-suggestions.json |
| agent-failure-analyzer⭐ | Error traces | LLM analyzes failures | analysis-report.json |
| agent-report-composer | All results | Compose reports | HTML/JSON reports |
| agent-test-coverage⭐ | Tests + requirements | Map and calculate coverage | coverage-report.json |
| agent-dev-ops🔧 | DevOps operations | Execute CI/CD, Docker, Git commands | operation-results.json |
| agent-api-gateway🔌 | API requests | Route, cache, test APIs | request-response.json |
| + 7 original agents | ... | Core framework functions | ... |

⭐ = New Phase 2 agent  
🔒 = New Phase 2.5 agent (Security/SQL)  
🔧 = New Phase 3 agent (DevOps)  
🔌 = New Phase 3 agent (API Gateway)

---

## How They Work Together

```
1. agent-ai-planner       ← Reads REQUIREMENTS.md
   ↓ (outputs: VSTP)
2. agent-test-data        ← Generates test data
   ↓ (outputs: generated data)
3. agent-explorer         ← Discovers UI elements
   ↓ (outputs: element locators)
4. agent-codegen          ← Generates test code
   ├─→ agent-sql-query-builder ← Validates/generates safe SQL queries
   ↓ (outputs: .spec.ts files with validated SQL)
5. Playwright             ← Executes tests
   ↓ (test results)
6a. agent-self-healing    ← Fixes broken selectors
6b. agent-failure-analyzer ← Analyzes failures
   ↓ (suggestions)
7a. agent-report-composer ← Generates reports
7b. agent-test-coverage   ← Validates coverage
   ↓ (final outputs)
8. agent-dev-ops          ← Deploy & infrastructure automation
   ├─ Docker build & push
   ├─ Git commit & push
   ├─ Jenkins pipeline trigger
   └─ Reports back results
   ↓
9. agent-api-gateway      ← API testing & management
   ├─ Test APIs in deployed environment
   ├─ Generate API documentation
   ├─ Monitor API health
   └─ Cache & route API requests
   ↓
10. Final deployment, API validation, and monitoring complete
```

See [SYSTEM-DESIGN.md](../SYSTEM-DESIGN.md) for comprehensive architecture details.
- Auto-heal selectors (optional)
- Learn from failures

**Input**: Test failures, element locators  
**Output**: Healing suggestions, healed selectors  
**Technologies**:
- Pixel-level element detection
- Fuzzy matching of selectors
- Machine learning for patterns
**Features**:
- Incremental healing
- Confidence scoring
- Rollback capability

---

## Agent Communication

### Message Format

All agents use standardized input/output:

```typescript
interface AgentInput<T> {
  taskId: string;
  payload: T;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

interface AgentOutput<T> {
  taskId: string;
  result: T;
  status: 'success' | 'failure' | 'skipped';
  error?: Error;
  metadata?: Record<string, any>;
  timestamp: Date;
}
```

### Execution Flow

```
Agent Input → Agent Execution → Artifact Generation → Validation → Agent Output
```

## Agent Configuration

Each agent has configuration in its package.json:

```json
{
  "name": "@agents/agent-name",
  "dependencies": {
    "@agents/agents-core": "workspace:*"
  }
}
```

## Agent Development

### Creating a New Agent

1. Create directory: `packages/agent-newagent`
2. Create `package.json` with `@agents/agents-core` dependency
3. Extend `BaseAgent` class from core
4. Implement `execute()` method
5. Register in pipeline orchestrator

### Agent Lifecycle

```
Initialize → Configure → Execute → Validate → Output → Cleanup
```

## Error Handling Strategy

| Agent | Failure Impact | Recovery |
|-------|---------------|----------|
| agent-connector | CRITICAL | Retry with backoff |
| agent-login | CRITICAL | Retry auth, use cached tokens |
| agent-catalog | WARNING | Skip missing utilities |
| agent-orchestrator | CRITICAL | Regenerate plan |
| agent-functional | WARNING | Continue with tests |
| agent-test-plan | WARNING | Auto-generate basic plans |
| agent-explorer | CRITICAL (for codegen) | Use last known repository |
| agent-codegen | CRITICAL | Use templates |
| agent-qa-gate | BLOCKING | Prevent Playwright |
| report-composer | WARNING | Generate partial reports |

## Performance Profile

| Agent | Avg Duration | Parallelizable |
|-------|-------------|----------------|
| agent-connector | 10-30s | No |
| agent-login | 20-60s | No |
| agent-catalog | 30-90s | No |
| agent-orchestrator | 20-45s | No |
| agent-functional | Variable | Yes |
| agent-test-plan | 30-60s | No |
| agent-explorer | 2-5min | No |
| agent-codegen | 30-90s | No |
| agent-qa-gate | 20-40s | No |
| Playwright | Variable | Yes |
| report-composer | 20-60s | No |

**Total Pipeline**: 5-30 minutes (depending on app complexity)