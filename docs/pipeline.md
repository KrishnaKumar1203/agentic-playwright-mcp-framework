# Pipeline Execution Guide

## Complete Execution Flow

The pipeline executes sequentially through 11 primary stages:

### Stage 1: Connection Resolution
**Agent**: `agent-connector`
- **Input**: Environment config + Credentials.xml
- **Process**: Resolve connection strings, validate connectivity
- **Output**: `artifacts/resolved/connection-config.json`
- **Duration**: ~10-30 seconds

### Stage 2: Authentication
**Agent**: `agent-login`
- **Input**: Connection config + Credentials
- **Process**: Authenticate, establish session, generate token
- **Output**: Auth tokens, session data
- **Duration**: ~20-60 seconds

### Stage 3: Service Catalog
**Agent**: `agent-catalog`
- **Input**: Session token + appModules/utils
- **Process**: Scan business utilities, map services
- **Output**: `artifacts/catalog/utilities.json`
- **Duration**: ~30-90 seconds

### Stage 4: Orchestration
**Agent**: `agent-orchestrator`
- **Input**: Service catalog + REQUIREMENTS.md
- **Process**: Plan test execution, sequence workflows
- **Output**: Execution plan, step definitions
- **Duration**: ~20-45 seconds

### Stage 5: Functional Testing
**Agent**: `agent-functional`
- **Input**: Execution plan + test logic
- **Process**: Execute functional tests, validate logic
- **Output**: Functional test results
- **Duration**: Varies by test count

### Stage 6: VSTP Building
**Agent**: `agent-test-plan`
- **Input**: Functional results + Requirements
- **Process**: Generate VSTP, map requirements to tests
- **Output**: `artifacts/vstp/*.vstp.json`
- **Duration**: ~30-60 seconds

### Stage 7: UI Element Discovery
**Agent**: `agent-explorer`
- **Input**: Application URL + Credentials
- **Process**: Navigate, find elements, extract locators
- **Output**: `artifacts/object-repository/elements.json`
- **Duration**: ~2-5 minutes (depends on app)

### Stage 8: Code Generation
**Agent**: `agent-codegen`
- **Input**: VSTP + Object repository
- **Process**: Generate Playwright test specs
- **Output**: `apps/tests/generated/*.spec.ts`
- **Duration**: ~30-90 seconds

### Stage 8.5: SQL Query Validation (Optional)
**Agent**: `agent-sql-query-builder`
- **Input**: Generated test code with database queries
- **Process**: Validate and generate safe SELECT-only queries, block DELETE/INSERT/UPDATE
- **Output**: `artifacts/sql-queries/validation-report.json`, safe query suggestions
- **Duration**: ~10-30 seconds
- **Security**: Ensures no data modification in test environment

### Stage 9: QA Gate Validation
**Agent**: `agent-qa-gate`
- **Input**: Generated code + Quality metrics
- **Process**: Validate gates, check coverage
- **Output**: `artifacts/qa-gate/qa-gate-report.json`
- **Duration**: ~20-40 seconds
- **Critical**: Blocks execution on failure

### Stage 10: Playwright Execution
**Tool**: Playwright Test Runner
- **Input**: Generated *.spec.ts files
- **Process**: Run tests, capture results/screenshots/videos
- **Output**: Test results, artifacts (screenshots, videos)
- **Duration**: Varies by test suite

### Stage 11: Report Composition
**Agent**: `agent-report-composer`
- **Input**: Playwright results + Artifacts from all stages
- **Process**: Aggregate results, generate reports
- **Output**: 
  - `artifacts/reports/summary.html`
  - `artifacts/reports/detail.html`
  - `artifacts/reports/db-report.html`
  - `artifacts/reports/traceability.html`
- **Duration**: ~20-60 seconds

## Running the Pipeline

### Full Pipeline Execution
```bash
npm run pipeline
```

This executes `scripts/run-pipeline.js` which orchestrates all 11 stages plus optional SQL validation.

### Running Individual Stages

You can run individual packages:

```bash
# Build specific agent
npm run build -w packages/agent-connector

# Run tests for specific agent
npm run test -w packages/agent-connector
```

### Pipeline Scripts

#### Generate Reports
```bash
npm run reports
```
Creates comprehensive test reports in `artifacts/reports/`

#### Clean Artifacts
```bash
npm run clean
```
Removes all generated artifacts, preparing for fresh run

#### Development Mode
```bash
npm run dev
```
Starts all packages in watch mode for development

### Configuration for Pipeline

Set environment before running:

```bash
# Development
export ENVIRONMENT=ISB_DEV

# QA
export ENVIRONMENT=ISB_QA

# UAT
export ENVIRONMENT=ISB_UAT

# Production
export ENVIRONMENT=ISB_PROD
```

## Pipeline Monitoring

### Artifact Validation
Each stage validates its output:
- JSON schema validation
- File existence checks
- Content integrity verification

### Error Handling
- **Non-critical failures**: Continue to next stage
- **Critical failures**: Stop pipeline, generate error report
- **QA Gate failure**: Prevents Playwright execution

### Logging
All stages log to `artifacts/logs/execution.log`:

```
[timestamp] [STAGE_NAME] [STATUS] [DETAILS]
```

## Performance Metrics

Typical total pipeline duration:
- **Quick Run** (cached artifacts): 2-3 minutes
- **Full Run** (fresh discovery): 5-10 minutes
- **Extended Run** (with Playwright): 10-30+ minutes

## Pipeline Dependencies

```
agent-connector
    ↓
agent-login (requires: connection)
    ↓
agent-catalog (requires: auth)
    ↓
agent-orchestrator (requires: catalog)
    ↓
agent-functional (requires: orchestration)
    ↓
agent-test-plan (requires: functional results)
    ↓
agent-explorer (requires: app access)
    ↓
agent-codegen (requires: explorer results)
    ↓
agent-sql-query-builder (OPTIONAL: validates SQL queries)
    ↓
agent-qa-gate (requires: generated code)
    ↓
Playwright (requires: qa-gate pass)
    ↓
agent-report-composer (requires: test results)
```

## Extended Agents

### SQL Query Validation (`agent-sql-query-builder`)
- Runs after code generation (optional)
- Validates and suggests safe SQL queries
- **Strict Security**: Only SELECT queries allowed
- **Blocks**: DELETE, INSERT, UPDATE, DROP, CREATE, ALTER, TRUNCATE, GRANT, REVOKE, EXEC
- Input: `*.spec.ts` files with database queries
- Output: `artifacts/sql-queries/validation-report.json`
- **Security Features**:
  - SQL injection prevention
  - Stacked query detection
  - Performance optimization suggestions (SELECT *, missing LIMIT)

### Code Transformation (`agent-codemod`)
- Runs after code generation
- Refactors generated test code
- Applies coding standards
- Input: `*.spec.ts` files
- Output: Refactored test files

### Selector Healing (`agent-healer`)
- Runs during Playwright execution
- Detects flaky selectors
- Generates repair suggestions
- Can auto-heal on subsequent runs