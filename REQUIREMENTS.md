# Agentic Playwright MCP Framework - Requirements

## Project Overview

This is an intelligent test automation framework built with Playwright and Model Context Protocol (MCP) servers. It uses a multi-agent architecture to orchestrate test planning, execution, validation, and reporting.

## Core Components

### 1. Agent Architecture

#### Agent Flow:
```
codemodconfig
    ↓
agent-connector (Connection Resolution)
    ↓
artifacts/resolved
    ↓
agent-login (Login Agent)
    ↓
agent-catalog (Service Catalog)
    ↓
agent-orchestrator (Test Orchestration)
    ↓
agent-functional (Functional Testing)
    ↓
agent-test-plan (VSTP Builder)
    ↓
artifacts/vstp
    ↓
agent-explorer (UI Element Exploration)
    ↓
object-repository
    ↓
agent-codegen (Spec Generation)
    ↓
apps/tests/generated
    ↓
agent-qa-gate (QA Validation)
    ↓
Playwright Execution
    ↓
agent-report-composer (Report Generation)
    ↓
artifacts/reports
```

### 2. Agents

1. **agent-connector**: Connection and credential management
2. **agent-login**: Authentication and session handling
3. **agent-catalog**: Service catalog and business utilities mapping
4. **agent-orchestrator**: Test orchestration and workflow management
5. **agent-functional**: Functional testing logic and assertions
6. **agent-test-plan**: VSTP (Vendor Specific Test Plan) builder
7. **agent-explorer**: UI element discovery and repository building
8. **agent-codegen**: Code generation from specifications
9. **agent-qa-gate**: QA validation and gate checks
10. **agent-report-composer**: Report generation and composition
11. **agent-codemod**: Code transformation and refactoring
12. **agent-healer**: Selector healing for flaky tests

### 3. Configuration Management

- **config/path.properties**: Path configurations
- **config/credentials/Credentials.xml**: Secure credential storage
- **config/urls/Application_Url_Config.xlsx**: URL configurations
- **config/environments/**: Environment-specific properties (DEV, QA, UAT, PROD)

### 4. Artifact Pipeline

- **artifacts/resolved/**: Resolved connection configurations
- **artifacts/catalog/**: Service catalog utilities
- **artifacts/vstp/**: Vendor-specific test plans
- **artifacts/object-repository/**: Element locators and pageobject models
- **artifacts/qa-gate/**: QA validation reports
- **artifacts/reports/**: Final test execution reports
- **artifacts/logs/**: Execution logs

### 5. Test Applications

- **apps/example-webapp-tests/**: Example Playwright test application
  - `tests/generated/`: Agent-generated test specs
  - `tests/manual/`: Manually written tests
  - `pageObjects/`: Page object models
  - `features/`: Feature files (BDD)
  - `test-data/`: Test datasets
  - `utils/`: Utility functions

### 6. Business Modules

- **appModules/utils/**: Business utilities scanned by catalog agent

## Technology Stack

- **Language**: TypeScript (ES2020+)
- **Test Framework**: Playwright
- **Node Version**: 18+
- **Package Manager**: npm with workspaces
- **Architecture**: MCP-based multi-agent system

## Environment Setup

Support for multiple environments:
- ISB_DEV
- ISB_QA
- ISB_UAT
- ISB_PROD

## Key Features

✅ Multi-agent orchestration
✅ Automated test plan generation
✅ Dynamic element discovery
✅ Code generation from specs
✅ QA gate validation
✅ Comprehensive reporting
✅ Credential management
✅ Environment-based configuration
✅ Artifact pipeline automation
✅ Selector healing capability

## Execution Flow

1. **agent-connector**: Establish application connection
2. **agent-login**: Perform authentication
3. **agent-catalog**: Discover business services
4. **agent-orchestrator**: Plan test execution
5. **agent-functional**: Execute functional tests
6. **agent-test-plan**: Build VSTP
7. **agent-explorer**: Discover UI elements
8. **agent-codegen**: Generate test code
9. **agent-qa-gate**: Validate quality gates
10. **Playwright**: Execute generated tests
11. **agent-report-composer**: Compile results

## Development

```bash
npm install              # Install all dependencies
npm run build           # Build all packages
npm run dev             # Start development mode
npm run test            # Run tests
npm run pipeline        # Execute full pipeline
npm run clean           # Clean artifacts
npm run reports         # Generate reports
```

## Contribution Guidelines

See CONTRIBUTING.md for detailed contribution guidelines.

## System Design

See SYSTEM-DESIGN.md for comprehensive system architecture documentation.
