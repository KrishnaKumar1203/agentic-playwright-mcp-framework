# Architecture Overview

## Multi-Agent Agentic Framework

This document provides a comprehensive overview of the Agentic Playwright MCP Framework architecture.

## System Components

### 1. **Core Agent Framework** (`packages/agents-core`)

The foundation of the multi-agent system providing:

- **Agent Interface**: Base class and types for all agents
- **Message Protocol**: Standardized input/output formats
- **Execution Context**: Shared configuration and logging
- **Lifecycle Management**: Agent initialization, execution, and cleanup

### 2. **Sequential Agent Pipeline**

```
┌─────────────────────────────────────────────────────────────┐
│                     Agentic Pipeline                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [1] agent-connector                                         │
│      └─> Resolve connections & credentials                  │
│      └─> Output: connection-config.json                     │
│          │                                                   │
│          ▼                                                   │
│  [2] agent-login                                            │
│      └─> Authenticate & establish session                   │
│      └─> Output: auth-token, session-data                   │
│          │                                                   │
│          ▼                                                   │
│  [3] agent-catalog                                          │
│      └─> Discover business services & utilities             │
│      └─> Output: service-catalog.json                       │
│          │                                                   │
│          ▼                                                   │
│  [4] agent-orchestrator                                     │
│      └─> Plan test execution workflow                       │
│      └─> Output: execution-plan.json                        │
│          │                                                   │
│          ▼                                                   │
│  [5] agent-functional                                       │
│      └─> Execute functional test logic                      │
│      └─> Output: test-results.json                          │
│          │                                                   │
│          ▼                                                   │
│  [6] agent-test-plan                                        │
│      └─> Build VSTP (test specifications)                   │
│      └─> Output: *.vstp.json files                          │
│          │                                                   │
│          ▼                                                   │
│  [7] agent-explorer                                         │
│      └─> Discover UI elements & locators                    │
│      └─> Output: elements.json (object repository)          │
│          │                                                   │
│          ▼                                                   │
│  [8] agent-codegen                                          │
│      └─> Generate test code from specifications             │
│      └─> Output: *.spec.ts files                            │
│          │                                                   │
│          ▼                                                   │
│  [9] agent-qa-gate                                          │
│      └─> Validate quality gates                             │
│      └─> Output: qa-gate-report.json                        │
│          │                                                   │
│          ▼                                                   │
│  [10] Playwright Execution                                   │
│      └─> Run generated test cases                           │
│      └─> Output: test-results.json, screenshots, videos     │
│          │                                                   │
│          ▼                                                   │
│  [11] agent-report-composer                                 │
│      └─> Compose comprehensive reports                      │
│      └─> Output: HTML, JSON, XML reports                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Artifact Pipeline

```
artifacts/
├── resolved/                 ← agent-connector output
│   └── connection-config.json
├── catalog/                  ← agent-catalog output
│   └── utilities.json
├── vstp/                     ← agent-test-plan output
│   └── *.vstp.json
├── object-repository/        ← agent-explorer output
│   └── elements.json
├── qa-gate/                  ← agent-qa-gate output
│   └── qa-gate-report.json
├── reports/                  ← Final reports
│   ├── summary.html
│   ├── detail.html
│   ├── db-report.html
│   └── traceability.html
└── logs/
    └── execution.log
```

## Configuration Hierarchy

```
config/
├── path.properties           ← Base path configuration
├── credentials/
│   └── Credentials.xml       ← Encrypted credentials
├── urls/
│   └── Application_Url_Config.xlsx
└── environments/
    ├── ISB_DEV_Env.properties
    ├── ISB_QA_Env.properties
    ├── ISB_UAT_Env.properties
    └── ISB_PROD_Env.properties
```

## Agent Responsibilities

### Connection Agent
- Resolves connection strings
- Validates network connectivity
- Manages connection pooling

### Login Agent
- Handles authentication flows
- Manages session tokens
- Refreshes expired credentials

### Catalog Agent
- Scans business modules (appModules/utils)
- Maps service APIs
- Catalogs available utilities

### Orchestrator Agent
- Plans test execution
- Sequences agent execution
- Manages inter-agent dependencies

### Functional Agent
- Executes business logic tests
- Validates functional requirements
- Generates functional test results

### Test Plan Agent
- Generates VSTP documents
- Maps requirements to test cases
- Tracks test coverage

### Explorer Agent
- Discovers UI elements
- Extracts locators
- Builds object repository

### CodeGen Agent
- Generates test specifications
- Creates Playwright test files
- Produces feature file implementations

### QA Gate Agent
- Validates quality metrics
- Checks coverage thresholds
- Blocks execution on gate failures

### Report Composer Agent
- Aggregates test results
- Generates HTML reports
- Creates traceability matrices

### Additional Agents
- **Codemod**: Code transformation and refactoring
- **Healer**: Detects and repairs flaky selectors

## Technology Stack

- **TypeScript**: Type-safe implementation
- **Node.js v18+**: Runtime environment
- **npm Workspaces**: Monorepo management
- **Playwright**: Test execution engine
- **MCP**: Model Context Protocol integration
- **Pino**: Structured logging

## Data Flow

1. **Input**: Configuration files + Environment settings
2. **Processing**: Sequential agent execution
3. **Artifacts**: JSON artifacts at each stage
4. **Output**: Comprehensive test reports

## Error Handling

- Graceful agent failure with fallback
- Artifact validation at each stage
- Comprehensive error logging
- QA gate prevention of bad runs

## Performance Considerations

- Parallel agent execution where possible
- Artifact caching between runs
- Efficient element selector resolution
- Optimized test code generation

## Security

- Encrypted credential storage
- Environment-based secret management
- Secure token handling
- Audit logging for all operations
I --> J[Object Repository]
J --> K[Agent Codegen]
K --> L[Playwright Specs]
L --> M[QA Gate]
M --> N[Playwright Execution]
N --> O[Reports]
```