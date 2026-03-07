# Complete Architecture & Linkage Map
## Agentic Playwright MCP Framework

**Last Updated**: March 7, 2026  
**Total Agents**: 19 across 7 layers  
**Total Packages**: 20 (1 core + 19 agents)  
**Technology Stack**: Node.js 18+, TypeScript, Playwright, npm workspaces

---

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [7-Layer Architecture](#7-layer-architecture)
3. [19 Agents & Their Roles](#19-agents--their-roles)
4. [Component Linkages](#component-linkages)
5. [Data Flow & Dependencies](#data-flow--dependencies)
6. [Configuration Hierarchy](#configuration-hierarchy)
7. [Artifact Pipeline](#artifact-pipeline)
8. [Technology Dependencies](#technology-dependencies)

---

## 📁 Project Structure

```
agentic-playwright-mcp-framework/
│
├── 📦 ROOT CONFIGURATION FILES
│   ├── package.json                    ← Workspace definition & scripts
│   ├── tsconfig.json                   ← TypeScript configuration
│   ├── playwright.config.ts            ← Playwright configuration
│   ├── .env.example                    ← Environment variables template
│   ├── .gitignore                      ← Git ignore rules
│   ├── REQUIREMENTS.md                 ← Test requirements input
│   └── README.md                       ← Project overview
│
├── 📂 CONFIGURATION (/config/)
│   ├── path.properties                 ← Base path configuration
│   ├── credentials/                    ← Encrypted credentials
│   │   └── Credentials.xml             ← Credential vault
│   ├── environments/                   ← Environment-specific configs
│   │   ├── ISB_DEV_Env.properties     → Maps to env-based agents
│   │   ├── ISB_QA_Env.properties
│   │   ├── ISB_UAT_Env.properties
│   │   └── ISB_PROD_Env.properties
│   └── urls/                           ← Application URL configs
│       └── Application_Url_Config.xlsx
│
├── 📂 BUSINESS MODULES (/appModules/)
│   └── utils/                          ← Business utility functions
│       ├── Authentication.ts           ↑ Scanned by agent-catalog
│       ├── DatabaseOperations.ts       ↑ Maps to agent-functional
│       ├── ApiHelpers.ts               ↑ Helps with test context
│       └── ... [other utils]
│
├── 📂 PACKAGES (/packages/) - 20 TOTAL
│   │
│   ├── 🏗️ FRAMEWORK CORE
│   │   └── agents-core/                ← Base Agent class & interfaces
│   │       ├── src/
│   │       │   ├── agent.ts            ← Agent base class
│   │       │   ├── types.ts            ← Shared interfaces
│   │       │   ├── logger.ts           ← Logging utilities
│   │       │   └── context.ts          ← Execution context
│   │       └── package.json            ← Dependencies: pino, uuid
│   │
│   ├── 🔌 CONNECTION & AUTH (Layer 1-2)
│   │   ├── agent-connector/            ← Layer 1: Connection setup
│   │   │   └── Resolves app connections
│   │   │       ↓ Outputs: connection-config.json
│   │   │
│   │   └── agent-login/                ← Layer 1: Authentication
│   │       └── Handles auth flows
│   │           ↓ Outputs: auth-token
│   │
│   ├── 📋 CATALOG & PLANNING (Layer 2)
│   │   ├── agent-catalog/              ← Layer 1: Service discovery
│   │   │   ├── Scans: appModules/utils
│   │   │   └── Outputs: service-catalog.json
│   │   │       ↓
│   │   │
│   │   ├── agent-orchestrator/         ← Layer 1: Pipeline planning
│   │   │   ├── Input: Requirements + catalog
│   │   │   └── Outputs: execution-plan.json
│   │   │       ↓
│   │   │
│   │   ├── agent-functional/           ← Layer 1: Business logic
│   │   │   ├── Input: Execution plan
│   │   │   └── Outputs: test-results.json
│   │   │       ↓
│   │   │
│   │   ├── agent-ai-planner/ ⭐ NEW   ← Layer 2: AI Test Planning
│   │   │   ├── Input: REQUIREMENTS.md + LLM
│   │   │   ├── LLM: OpenAI/Anthropic
│   │   │   └── Outputs: ai-generated-test-plan.json
│   │   │       ↓
│   │   │
│   │   └── agent-test-data/ ⭐ NEW    ← Layer 2: Dynamic data
│   │       ├── Library: Faker.js
│   │       └── Outputs: generated-data.json
│   │           ↓
│   │
│   ├── 🔍 DISCOVERY (Layer 3)
│   │   ├── agent-test-plan/            ← Layer 1: VSTP generation
│   │   │   ├── Input: Functional results + requirements
│   │   │   └── Outputs: *.vstp.json
│   │   │       ↓
│   │   │
│   │   ├── agent-explorer/             ← Layer 3: UI Discovery
│   │   │   ├── Navigates: Target app
│   │   │   ├── Finds: Buttons, inputs, links
│   │   │   └── Outputs: elements.json (Object Repository)
│   │   │       ↓
│   │   │
│   │   └── agent-dom-analyzer/ ⭐ NEW ← Layer 3: DOM changes
│   │       ├── Detects: Element changes
│   │       ├── Severity: critical/major/minor
│   │       └── Outputs: dom-diff/changes.json
│   │           ↓
│   │
│   ├── ⚙️ GENERATION (Layer 4)
│   │   ├── agent-codegen/              ← Layer 4: Code generation
│   │   │   ├── Input: VSTP + Object repo
│   │   │   ├── Validates: Via agent-sql-query-builder
│   │   │   └── Outputs: *.spec.ts files
│   │   │       ↓
│   │   │
│   │   ├── agent-sql-query-builder/ 🔒 NEW ← Layer 4: SQL Safety
│   │   │   ├── Validates: SQL queries (SELECT-only)
│   │   │   ├── Blocks: DELETE, INSERT, UPDATE, DROP, etc.
│   │   │   ├── Libraries: sql-bricks, sql-parser-cst
│   │   │   └── Outputs: sql-queries/validation-report.json
│   │   │       ↑ Called by: agent-codegen
│   │   │
│   │   └── agent-codemod/              ← Layer 4: Code refactoring
│   │       ├── Transforms: Generated code
│   │       └── Outputs: Refactored *.spec.ts
│   │           ↓
│   │
│   ├── 🚀 QA GATE (Layer 4→5 transition)
│   │   └── agent-qa-gate/              ← Quality validation gate
│   │       ├── Validates: Code coverage, metrics
│   │       ├── Blocks: Low-quality code
│   │       └── Outputs: qa-gate-report.json
│   │           ↓
│   │
│   ├── 🧠 INTELLIGENCE (Layer 6)
│   │   ├── agent-self-healing/ ⭐ NEW ← Layer 6: Auto-fix selectors
│   │   │   ├── Detects: Broken selectors
│   │   │   ├── Algorithm: String similarity + fuzzy matching
│   │   │   ├── Runs: During test execution on failures
│   │   │   └── Outputs: healing-strategies.json
│   │   │
│   │   └── agent-failure-analyzer/ ⭐ NEW ← Layer 6: Failure analysis
│   │       ├── LLM: OpenAI/Anthropic
│   │       ├── Analyzes: Test failure root causes
│   │       ├── Suggests: Fix strategies with confidence
│   │       └── Outputs: failure-analysis/reports.json
│   │           ↓
│   │
│   └── 📊 REPORTING (Layer 7)
│       ├── agent-report-composer/      ← Layer 7: Report generation
│       │   ├── Aggregates: All results
│       │   ├── Formats: HTML, JSON, XML
│       │   └── Outputs: summary.html, detail.html, traceability.html
│       │
│       ├── agent-test-coverage/ ⭐ NEW ← Layer 7: Coverage analysis
│       │   ├── Maps: Tests to requirements
│       │   ├── Calculates: Coverage %
│       │   └── Outputs: coverage-matrix.json, traceability.json
│       │
│       └── agent-healer/               ← Layer 6: Selector repairs
│           ├── Updates: Broken selectors
│           └── Confidence: High/Medium/Low
│
├── 📂 APPLICATIONS (/apps/)
│   └── example-webapp-tests/            ← Test application
│       ├── tests/
│       │   ├── generated/              ← Generated by agent-codegen
│       │   │   └── *.spec.ts          ← Playwright test specs
│       │   └── fixtures/
│       ├── page-objects/               ← Generated by agent-codegen
│       ├── playwright.config.ts
│       └── package.json
│
├── 📂 ARTIFACTS (/artifacts/)
│   └── [Generated at runtime by pipeline]
│       ├── resolved/                   ← agent-connector outputs
│       │   └── connection-config.json
│       ├── catalog/                    ← agent-catalog outputs
│       │   └── utilities.json
│       ├── vstp/                       ← agent-test-plan outputs
│       │   ├── *.vstp.json
│       │   └── ai-generated-test-plan.json (agent-ai-planner)
│       ├── test-data/                  ← agent-test-data outputs
│       │   └── generated-data.json
│       ├── object-repository/          ← agent-explorer outputs
│       │   └── elements.json
│       ├── dom-diff/                   ← agent-dom-analyzer outputs
│       │   └── changes.json
│       ├── sql-queries/                ← agent-sql-query-builder outputs
│       │   └── validation-report.json
│       ├── qa-gate/                    ← agent-qa-gate outputs
│       │   └── qa-gate-report.json
│       ├── healing/                    ← agent-self-healing outputs
│       │   └── strategies.json
│       ├── failure-analysis/           ← agent-failure-analyzer outputs
│       │   └── reports.json
│       ├── coverage/                   ← agent-test-coverage outputs
│       │   ├── coverage-matrix.json
│       │   └── traceability.json
│       ├── reports/                    ← agent-report-composer outputs
│       │   ├── summary.html
│       │   ├── detail.html
│       │   ├── db-report.html
│       │   └── traceability.html
│       └── logs/
│           └── execution.log
│
└── 📂 DOCUMENTATION (/docs/)
    ├── architecture.md                 ← System architecture
    ├── agents.md                       ← Complete agents reference
    ├── pipeline.md                     ← Pipeline execution guide
    └── ... [other docs]
```

---

## 🏗️ 7-Layer Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 7: REPORTING & METRICS                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  agent-report-composer  →  Aggregates results  →  HTML/JSON/XML reports │
│         ↑                                              ↑                  │
│         └──────────────────────────────────────────────┘                 │
│                                                                           │
│  agent-test-coverage    →  Maps tests to needs  →  Coverage matrix      │
│         ↑                                              ↑                  │
│         └──────────────────────────────────────────────┘                 │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 6: INTELLIGENCE & HEALING                                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  agent-self-healing     →  Detects broken selectors  →  Auto-fixes       │
│         ↑                                              ↑                  │
│         └──────────────────────────────────────────────┘                 │
│                                                                           │
│  agent-failure-analyzer →  Analyzes test failures   →  Root cause fix    │
│         ↑                                              ↑                  │
│         └──────────────────────────────────────────────┘                 │
│                                                                           │
│  agent-healer           →  Repairs selectors       →  Updated specs      │
│         ↑                                              ↑                  │
│         └──────────────────────────────────────────────┘                 │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 5: EXECUTION (Test Runner)                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────┐         │
│  │  Playwright Test Runner (@playwright/test)                  │         │
│  │  ├─ Chrome, Firefox, WebKit browsers                        │         │
│  │  ├─ Parallel & sequential execution                         │         │
│  │  └─ Screenshots, videos, traces                             │         │
│  └─────────────────────────────────────────────────────────────┘         │
│             ↑                                      ↑                      │
│             │ Input: *.spec.ts                    │ Output: results.json  │
│             │                                     │                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 4: GENERATION & VALIDATION                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌──────────────────┐                                                    │
│  │ agent-codegen    │  ← Generates test code                             │
│  │   ↓              │                                                    │
│  │   Calls: agent-sql-query-builder for SQL validation                   │
│  │   ↓              │                                                    │
│  │ *.spec.ts files  │                                                    │
│  └──────────────────┘                                                    │
│         ↓                                                                 │
│  ┌──────────────────┐                                                    │
│  │agent-sql-query-  │  ← Validates SQL (SELECT-only)                     │
│  │builder    🔒     │                                                    │
│  │ Blocks: DELETE,  │                                                    │
│  │ INSERT, UPDATE   │                                                    │
│  └──────────────────┘                                                    │
│         ↓                                                                 │
│  ┌──────────────────┐                                                    │
│  │ agent-codemod    │  ← Refactors code                                  │
│  │ *.spec.ts files  │                                                    │
│  └──────────────────┘                                                    │
│         ↓                                                                 │
│  ┌──────────────────┐                                                    │
│  │ agent-qa-gate    │  ← Quality gates                                   │
│  │ qa-gate-report   │                                                    │
│  └──────────────────┘                                                    │
│             ↑                                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 3: DISCOVERY & ANALYSIS                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  agent-explorer         →  Finds UI elements  →  elements.json           │
│         ↑                                          ↑                      │
│         │                                          │                      │
│         └──────────────────────────────────────────┘                     │
│                                                                           │
│  agent-dom-analyzer     →  Detects changes   →  dom-diff/changes.json    │
│         ↑                                          ↑                      │
│         │                                          │                      │
│         └──────────────────────────────────────────┘                     │
│             ↑                                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 2: PLANNING & DATA GENERATION                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  agent-ai-planner  ⭐  →  AI test planning  →  ai-generated-test-plan    │
│         ↑                                          ↑                      │
│         │ Input: REQUIREMENTS.md + LLM settings  │ LLM calls             │
│         │                                         │                      │
│  agent-test-data   ⭐  →  Faker.js generation →  generated-data.json     │
│         ↑                                          ↑                      │
│         │                                         │                      │
│         └──────────────────────────────────────────┘                    │
│                                                                           │
│  agent-test-plan      →  VSTP building     →  *.vstp.json               │
│  agent-orchestrator   →  Workflow planning  →  execution-plan.json       │
│  agent-functional     →  Business logic     →  test-results.json         │
│         ↑                                          ↑                      │
│         │                                         │                      │
│         └──────────────────────────────────────────┘                    │
│             ↑                                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↑
┌─────────────────────────────────────────────────────────────────────────┐
│ LAYER 1: CONFIGURATION & CONNECTIVITY                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Environment Variables  →  config/environments/*.properties              │
│         ↑                                          ↑                      │
│  Credentials            →  config/credentials/Credentials.xml            │
│         ↑                                          ↑                      │
│  Paths                  →  config/path.properties                        │
│         ↑                                          ↑                      │
│  Business Utils         →  appModules/utils/                             │
│         ↑                                          ↑                      │
│         │                                         │                      │
│  agent-connector        →  Connection setup →  connection-config.json    │
│         ↑                                          ↑                      │
│  agent-login            →  Authentication   →  auth-token               │
│         ↑                                          ↑                      │
│  agent-catalog          →  Service discovery →  utilities.json           │
│             ↑                                    ↑                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 19 Agents & Their Roles

### LAYER 1: Configuration & Connectivity (No specific agents - Infrastructure)

| Component | Purpose | Input | Output |
|-----------|---------|-------|--------|
| config/ | Store credentials, paths, env-specific settings | - | Environment setup |
| appModules/utils | Business utility functions | - | Helper functions for agents |

### LAYER 1-2: CORE PIPELINE AGENTS

| # | Agent | Layer | Purpose | Input | Output | Key Tech |
|---|-------|-------|---------|-------|--------|----------|
| 1 | agent-connector | 1 | Connection setup | env config | connection-config.json | Node.js, Axios |
| 2 | agent-login | 1 | Authentication | connection + credentials | auth-token, session | OAuth, REST APIs |
| 3 | agent-catalog | 1 | Service discovery | appModules/utils | utilities.json | File scanning, mapping |
| 4 | agent-orchestrator | 1 | Pipeline planning | catalog + requirements | execution-plan.json | Dependency mapping |
| 5 | agent-functional | 1 | Business logic testing | execution plan | test-results.json | Business rules validation |
| 6 | agent-test-plan | 1 | VSTP generation | functional results + reqs | *.vstp.json | Requirement mapping |

### LAYER 2: AI-DRIVEN PLANNING & DATA

| # | Agent | Layer | Purpose | Input | Output | Key Tech |
|---|-------|-------|---------|-------|--------|----------|
| 7 | agent-ai-planner ⭐ | 2 | AI test planning | REQUIREMENTS.md + LLM | ai-generated-test-plan.json | OpenAI, Anthropic |
| 8 | agent-test-data ⭐ | 2 | Dynamic data generation | Data patterns | generated-data.json | Faker.js, UUID |

### LAYER 3: DISCOVERY & ANALYSIS

| # | Agent | Layer | Purpose | Input | Output | Key Tech |
|---|-------|-------|---------|-------|--------|----------|
| 9 | agent-explorer | 3 | UI element discovery | App URL + credentials | elements.json | Playwright Inspector |
| 10 | agent-dom-analyzer ⭐ | 3 | DOM change detection | Old DOM + new DOM | dom-diff/changes.json | Cheerio, Diff library |

### LAYER 4: GENERATION & VALIDATION

| # | Agent | Layer | Purpose | Input | Output | Key Tech |
|---|-------|-------|---------|-------|--------|----------|
| 11 | agent-codegen | 4 | Test code generation | VSTP + object repo | *.spec.ts files | TypeScript, Playwright |
| 12 | agent-sql-query-builder 🔒 | 4 | SQL validation (SELECT-only) | SQL queries | validation-report.json | sql-bricks, sql-parser-cst |
| 13 | agent-codemod | 4 | Code transformation | *.spec.ts | Refactored *.spec.ts | AST manipulation |
| 14 | agent-qa-gate | 4 | Quality validation | Generated code | qa-gate-report.json | Code metrics, coverage |

### LAYER 6: INTELLIGENCE & HEALING

| # | Agent | Layer | Purpose | Input | Output | Key Tech |
|---|-------|-------|---------|-------|--------|----------|
| 15 | agent-self-healing ⭐ | 6 | Selector auto-repair | Failed selectors | healing-strategies.json | String similarity, regex |
| 16 | agent-failure-analyzer ⭐ | 6 | Failure analysis | Test failures | failure-analysis/reports.json | OpenAI, LLM APIs |
| 17 | agent-healer | 6 | Selector repair | Broken selectors | Updated *.spec.ts | Smart replacement |

### LAYER 7: REPORTING & METRICS

| # | Agent | Layer | Purpose | Input | Output | Key Tech |
|---|-------|-------|---------|-------|--------|----------|
| 18 | agent-report-composer | 7 | Report generation | All results | HTML/JSON/XML reports | Handlebars, JSON |
| 19 | agent-test-coverage ⭐ | 7 | Coverage analysis | Results + requirements | coverage-matrix.json | Requirement mapping |

**Legend**: ⭐ = New Phase 2 Agent | 🔒 = Security/Sensitive | 👥 = Multiple agents with same base

---

## 🔗 Component Linkages

### EXECUTION GRAPH: Agent Dependencies & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PIPELINE EXECUTION SEQUENCE (Linear with Optional Branches)              │
└─────────────────────────────────────────────────────────────────────────┘

[1] LOAD CONFIGURATION
     ↓
     ├── Read: config/environments/{ENVIRONMENT}.properties
     ├── Read: config/credentials/Credentials.xml
     ├── Read: config/path.properties
     ├── Read: config/urls/Application_Url_Config.xlsx
     ├── Read: appModules/utils/* (business modules)
     └── Load: .env file (if exists)

[2] agent-connector
     ├─ Input: Connection strings from config/
     ├─ Validates: Network connectivity
     └─ Outputs: artifacts/resolved/connection-config.json
                 ↓
[3] agent-login
     ├─ Input: connection-config.json + credentials
     ├─ Performs: Authentication (OAuth, REST, DB)
     └─ Outputs: auth-token, session-data
                 ↓
[4] agent-catalog
     ├─ Input: appModules/utils/* files + auth-token
     ├─ Scans: Business utility functions
     └─ Outputs: artifacts/catalog/utilities.json
                 ↓
[5] agent-orchestrator
     ├─ Input: utilities.json + REQUIREMENTS.md
     ├─ Plans: Test execution workflow
     └─ Outputs: artifacts/execution-plan.json
                 ↓
[6] agent-functional  
     ├─ Input: execution-plan.json
     ├─ Executes: Business logic tests
     └─ Outputs: artifacts/functional/test-results.json
                 ↓
         ┌─────────────────────────────────────────┐
         │ PARALLEL EXECUTION BRANCHES              │
         └─────────────────────────────────────────┘
         
         ├─[Branch A]─────────────────────────────┐
         │                                          │
         │ [7] agent-test-plan                      │
         │  ├─ Input: test-results.json             │
         │  │         + REQUIREMENTS.md             │
         │  └─ Outputs: artifacts/vstp/*.vstp.json │
         │                 ↓                        │
         │                                          │
         └─────────────────────────────────────────┘
                         ↓
         ├─[Branch B]─────────────────────────────┐
         │                                          │
         │ [7B] agent-ai-planner ⭐ (ALTERNATIVE) │
         │  ├─ Input: REQUIREMENTS.md + LLM        │
         │  │ (OpenAI/Anthropic API)               │
         │  └─ Outputs: ai-generated-test-plan.json│
         │                 ↓                        │
         │                                          │
         └─────────────────────────────────────────┘
                         ↓
         ├─[Branch C]─────────────────────────────┐
         │                                          │
         │ [8] agent-test-data ⭐                  │
         │  ├─ Input: Data patterns (YAML/JSON)   │
         │  └─ Outputs: generated-data.json        │
         │      (Faker.js: Names, emails, addresses) │
         │                                          │
         └─────────────────────────────────────────┘
         
         ┌──────────────────────────────────────────────┐
         │ MERGE: All branches converge for discovery   │
         └──────────────────────────────────────────────┘
                         ↓
[9] agent-explorer
     ├─ Input: App URL + auth-token
     ├─ Actions: Navigate, inspect, screenshot
     ├─ Finds: Buttons, inputs, links, labels
     ├─ Extracts: CSS, XPath, data-testid selectors
     └─ Outputs: artifacts/object-repository/elements.json
                 ↓
[10] agent-dom-analyzer ⭐  
     ├─ Input: snapshot-1.json + snapshot-2.json
     ├─ Compares: DOM structures
     ├─ Detects: Added, removed, modified elements
     └─ Outputs: artifacts/dom-diff/changes.json
                 ↓
         ┌─────────────────────────────────────┐
         │ MERGE: Discovery + Planning results │
         └─────────────────────────────────────┘
                         ↓
[11] agent-codegen
     ├─ Input: *.vstp.json (from agent-test-plan or agent-ai-planner)
     │          elements.json (from agent-explorer)
     │          generated-data.json (from agent-test-data)
     ├─ Generates: Playwright test code
     │
     │ CALLS: agent-sql-query-builder (if SQL queries detected)
     │      ├─ Validates SQL for safety
     │      ├─ Blocks: DELETE, INSERT, UPDATE, DROP, CREATE
     │      ├─ Generates: Safe SELECT-only queries
     │      └─ Returns: Validated/safe SQL
     │
     └─ Outputs: apps/example-webapp-tests/tests/generated/*.spec.ts
                 apps/example-webapp-tests/page-objects/*.ts
                 ↓
[12] agent-codemod (Optional)
     ├─ Input: *.spec.ts files
     ├─ Transforms: Apply coding standards
     ├─ Refactors: Code optimization
     └─ Outputs: Refactored *.spec.ts
                 ↓
[13] agent-qa-gate
     ├─ Input: Generated *.spec.ts files
     ├─ Validates: Code quality, coverage
     ├─ Criterion: Must pass to proceed
     └─ Outputs: artifacts/qa-gate/qa-gate-report.json
        
        IF: qa-gate FAILS → STOP (Block execution)
        IF: qa-gate PASSES → Continue to execution
                 ↓
[14] PLAYWRIGHT EXECUTION (Test Runner)
     ├─ Command: npx playwright test
     ├─ Input: *.spec.ts files from apps/example-webapp-tests/
     ├─ Runs: Chrome, Firefox, WebKit (parallel)
     ├─ Records: Screenshots, videos, traces
     └─ Outputs: Test results JSON
                 artifacts/results/results.json
                 artifacts/logs/debug.log
                 ↓
         ┌────────────────────────────────────────┐
         │ IF: TEST FAILURES DETECTED → Healing  │
         └────────────────────────────────────────┘
             ↓
         [15] agent-self-healing ⭐ (On Failure)
              ├─ Input: Failed test name + error
              ├─ Detects: "selector not found"
              ├─ Algorithm: String similarity matching
              └─ Suggests: New selectors
                  Confidence: High/Medium/Low
                      ↓
         [17] agent-healer (If high confidence)
              ├─ Updates: *.spec.ts with new selector
              └─ Re-runs: Test on next iteration
              
         [16] agent-failure-analyzer ⭐
              ├─ Input: Test failure data
              ├─ LLM: Analyze root cause
              │   (OpenAI/Anthropic)
              ├─ Returns: Suggestions + explanation
              └─ Outputs: failure-analysis/report.json
                 ↓
                 
[18] REPORTING & FINAL ANALYSIS

     agent-report-composer
     ├─ Input: All results, logs, artifacts
     ├─ Aggregates: Pass/fail counts
     ├─ Generates: 
     │  ├─ summary.html (high-level overview)
     │  ├─ detail.html (test-by-test details)
     │  ├─ db-report.html (database changes)
     │  └─ traceability.html (req→test mapping)
     └─ Outputs: artifacts/reports/
                 
     agent-test-coverage ⭐
     ├─ Input: Results + REQUIREMENTS.md
     ├─ Maps: Tests to requirement IDs
     ├─ Calculates: Coverage %
     └─ Outputs: artifacts/coverage/
                 ├─ coverage-matrix.json
                 └─ traceability.json
                 
     Final Output: artifacts/reports/
                   ├─ summary.html ✓ or ✗
                   ├─ detail.html
                   ├─ db-report.html
                   └─ coverage-matrix.json
```

---

## 📊 Data Flow & Dependencies

### Inter-Agent Dependencies Matrix

```
FROM                    →  TO                      DATA                TRIGGER
────────────────────────────────────────────────────────────────────────────
agent-connector         →  agent-login             connection-config   Sequential
agent-login             →  agent-catalog           auth-token          Sequential
agent-catalog           →  agent-orchestrator      utilities.json      Sequential
agent-orchestrator      →  agent-functional        execution-plan      Sequential
agent-functional        →  agent-test-plan         test-results        Sequential
agent-functional        →  agent-ai-planner        (LLM planning)       Alternative path
agent-test-plan         →  agent-codegen           *.vstp.json         Sequential
agent-ai-planner        →  agent-codegen           ai-plan.json        Alternative input
agent-ai-planner        →  LLM APIs                Requirements.md      API calls
agent-test-data         →  agent-codegen           generated-data.json Sequential
agent-explorer          →  agent-codegen           elements.json       Parallel input
agent-explorer          →  agent-dom-analyzer      dom-snapshot        Comparison
agent-dom-analyzer      →  (reports)               dom-diff.json       Optional output
agent-codegen           →  agent-sql-query-builder *.spec.ts (SQL)     Called for validation
agent-sql-query-builder →  agent-codegen           validation-report   Returns to caller
agent-codegen           →  agent-codemod          *.spec.ts           Optional
agent-codemod           →  agent-qa-gate          Refactored *.spec.ts Sequential
agent-qa-gate           →  PLAYWRIGHT             Validated *.spec.ts  If passes
agent-qa-gate           →  (Reports)              qa-gate-report.json  Always logged
PLAYWRIGHT              →  agent-self-healing     Failed tests         On failure
PLAYWRIGHT              →  agent-failure-analyzer Test results         Always
agent-self-healing      →  agent-healer           Healing strategy     If confidence > 80%
agent-healer            →  PLAYWRIGHT             Updated *.spec.ts    Next run
PLAYWRIGHT              →  agent-report-composer  results.json         Always
agent-report-composer   →  agent-test-coverage    results + reqs       Sequential
agent-report-composer   →  (Final output)         HTML reports         Always
agent-test-coverage     →  (Final output)         Coverage matrix      Always
```

### Data Structure Linkages

```
Configuration Flow:
──────────────────
.env
  ↓
config/environments/{ENV}.properties
  ├─ URLs, database endpoints, hostnames
  ├─ Uses: Placeholders like ${DB_HOST}, ${APP_URL}
  └─ Read by: Every agent via environment variables

config/credentials/Credentials.xml
  ├─ Encrypted usernames/passwords
  ├─ API keys for LLM services
  └─ Database connection strings

config/path.properties
  ├─ Base paths for artifacts, logs, reports
  └─ Used by: All agents for output directories

appModules/utils/*.ts
  ├─ Business logic functions
  └─ Catalogued by: agent-catalog
     Used by: agent-functional, agents for testing


Artifact Linkage Chain:
──────────────────────
connection-config.json (agent-connector)
  ↓
  Used by: agent-login, agent-explorer, PLAYWRIGHT

auth-token (agent-login)
  ↓
  Used by: agent-catalog, agent-explorer, agent-functional

utilities.json (agent-catalog)
  ↓
  Used by: agent-orchestrator, agent-functional

execution-plan.json (agent-orchestrator)
  ↓
  Used by: agent-functional

test-results.json (agent-functional)
  ↓
  Used by: agent-test-plan, agent-report-composer

*.vstp.json (agent-test-plan OR agent-ai-planner)
  ↓
  Used by: agent-codegen

elements.json (agent-explorer)
  ↓
  Used by: agent-codegen

generated-data.json (agent-test-data)
  ↓
  Used by: agent-codegen (embedded in test code)

dom-diff.json (agent-dom-analyzer)
  ↓
  Used by: Reports, Change tracking

*.spec.ts (agent-codegen)
  ↓
  Validated by: agent-sql-query-builder (for SQL)
  Refactored by: agent-codemod (optional)
  Validated by: agent-qa-gate
  Executed by: PLAYWRIGHT
  Healed by: agent-healer (on failures)

PLAYWRIGHT results.json
  ↓
  Analyzed by: agent-failure-analyzer, agent-self-healing
  Reported by: agent-report-composer
  Covered by: agent-test-coverage

Final Outputs:
  ├─ summary.html (agent-report-composer)
  ├─ detail.html (agent-report-composer)
  ├─ coverage-matrix.json (agent-test-coverage)
  └─ traceability.json (agent-test-coverage)
```

---

## 🔧 Configuration Hierarchy

```
CONFIGURATION LOADING SEQUENCE
──────────────────────────────

Priority 1: Environment Variables (.env file or system ENV)
   │
   ├─ ENVIRONMENT=ISB_DEV|ISB_QA|ISB_UAT|ISB_PROD
   │
   ├─ LLM_PROVIDER=openai|anthropic
   ├─ OPENAI_API_KEY={key}
   ├─ ANTHROPIC_API_KEY={key}
   │
   ├─ APP_URL={URL}
   ├─ DATABASE_HOST={host}
   ├─ DATABASE_PORT={port}
   ├─ DATABASE_USER={user}
   ├─ DATABASE_PASSWORD={password}
   │
   ├─ ARTIFACTS_PATH=./artifacts
   ├─ LOGS_PATH=./artifacts/logs
   │
   └─ BROWSER_TYPE=chromium|firefox|webkit

Priority 2: Environment-Specific Config Files
   │
   └─ config/environments/{ENVIRONMENT}.properties
      ├─ ISB_DEV_Env.properties
      │   └─ DEV-specific endpoints, test accounts
      ├─ ISB_QA_Env.properties
      │   └─ QA-specific settings, parallel runs
      ├─ ISB_UAT_Env.properties
      │   └─ UAT config, production-like
      └─ ISB_PROD_Env.properties
          └─ PROD config, read-only operations

Priority 3: Static Config Files
   │
   ├─ config/path.properties
   │   └─ Base path configuration
   │
   ├─ config/credentials/Credentials.xml
   │   ├─ Encrypted credentials vault
   │   └─ API keys, connection strings
   │
   └─ config/urls/Application_Url_Config.xlsx
       └─ Application URLs by environment

Priority 4: Runtime Overrides
   └─ Command-line arguments, API parameters


USAGE BY AGENTS:
────────────────

agent-connector
  ├─ Reads: ENVIRONMENT, DATABASE_HOST, DATABASE_PORT, DATABASE_USER
  └─ Template: config/environments/{ENVIRONMENT}.properties

agent-login
  ├─ Reads: AUTH_USERNAME, AUTH_PASSWORD from Credentials.xml
  ├─ Reads: LLM_API_KEY for token generation
  └─ Reads: APP_URL from environment

agent-explorer
  ├─ Reads: APP_URL, BROWSER_TYPE
  ├─ Reads: Credentials for authentication
  └─ Writes: To ARTIFACTS_PATH/object-repository/

agent-codegen
  ├─ Reads: Multiple *.vstp.json files
  ├─ Reads: elements.json, generated-data.json
  ├─ Calls: agent-sql-query-builder for SQL queries
  └─ Writes: To apps/example-webapp-tests/tests/

agent-sql-query-builder
  ├─ Reads: Generated SQL from agent-codegen
  ├─ Validates: Against forbidden commands
  └─ Returns: Validation report

PLAYWRIGHT
  ├─ Reads: playwright.config.ts
  ├─ Reads: *.spec.ts test files
  ├─ Reads: ENVIRONMENT from env (for app URL)
  └─ Writes: To artifacts/results/

agent-report-composer
  ├─ Reads: All artifacts from artifacts/
  ├─ Reads: ENVIRONMENT for report title
  ├─ Reads: Credentials for DB query (read-only)
  └─ Writes: To artifacts/reports/
```

---

## 📦 Artifact Pipeline

### Artifact Generation Timeline

```
Starting Point: Load Configuration
├─ .env file
├─ config/ folder
└─ appModules/utils/

     ↓ agent-connector → artifacts/resolved/
     
├─ connection-config.json
│   {
│     "host": "db-server",
│     "port": 5432,
│     "database": "testdb",
│     "validated": true
│   }

     ↓ agent-login → auth-token

├─ { "token": "xyz...", "sessionId": "abc...", "validUntil": "..." }

     ↓ agent-catalog → artifacts/catalog/

├─ utilities.json
│   [
│     { "name": "Authentication.ts", "functions": [...] },
│     { "name": "DatabaseOperations.ts", "functions": [...] }
│   ]

     ↓ agent-orchestrator → artifacts/

├─ execution-plan.json

     ↓ agent-functional → artifacts/

├─ test-results.json

     ↓ PARALLEL: agent-test-plan + agent-ai-planner + agent-test-data

├─ vstp/
│   ├─ login-tests.vstp.json
│   ├─ checkout-tests.vstp.json
│   └─ ai-generated-test-plan.json
│
├─ test-data/
│   └─ generated-data.json
│       {
│         "users": [
│           { "email": "user1@example.com", "password": "secure123" }
│         ]
│       }

     ↓ agent-explorer + agent-dom-analyzer → artifacts/

├─ object-repository/
│   └─ elements.json
│       {
│         "loginButton": {
│           "css": "button.login-btn",
│           "xpath": "//button[@class='login-btn']",
│           "testid": "login-button"
│         }
│       }
│
├─ dom-diff/
│   └─ changes.json
│       {
│         "removed": ["#old-nav"],
│         "added": ["#new-header"],
│         "modified": ["button.login-btn"]
│       }

     ↓ agent-codegen (calls agent-sql-query-builder) → both

├─ apps/example-webapp-tests/tests/generated/
│   └─ login.spec.ts (Playwright test)
│
├─ sql-queries/
│   └─ validation-report.json
│       {
│         "validations": [
│           {
│             "query": "SELECT * FROM users",
│             "isValid": true,
│             "isSafe": true
│           }
│         ]
│       }

     ↓ agent-qa-gate → artifacts/qa-gate/

├─ qa-gate-report.json
│   {
│     "quality": 95,
│     "coverage": 87,
│     "passed": true
│   }

     ↓ PLAYWRIGHT execution → artifacts/results/

├─ results.json
├─ screenshots/
└─ videos/

     ↓ PARALLEL: agent-self-healing + agent-failure-analyzer

├─ healing/
│   └─ strategies.json
│
├─ failure-analysis/
│   └─ failure-report.json

     ↓ agent-report-composer + agent-test-coverage → artifacts/

├─ reports/
│   ├─ summary.html
│   ├─ detail.html
│   ├─ db-report.html
│   └─ traceability.html
│
├─ coverage/
│   ├─ coverage-matrix.json
│   └─ traceability.json

Final State: Complete Artifact Directory
```

---

## 🛠️ Technology Dependencies

### Root Dependencies Graph

```
agentic-playwright-mcp-framework (root)
│
├─ RUNTIME
│   └─ Node.js 18+ (engines: { node: ">=18.0.0" })
│
├─ BUILD & TEST
│   ├─ TypeScript 5.3.3
│   ├─ @playwright/test 1.40.0
│   ├─ @types/node 20.10.0
│   └─ concurrently 8.2.2
│
├─ LLM INTEGRATION
│   ├─ openai 4.52.0
│   │   └─ For: agent-ai-planner, agent-failure-analyzer
│   │   └─ APIs: Chat completion, embeddings
│   │
│   └─ @anthropic-ai/sdk 0.20.0
│       └─ For: agent-ai-planner (alternative), agent-failure-analyzer
│       └─ APIs: Claude models
│
├─ DATA & UTILITIES
│   ├─ @faker-js/faker 8.3.1
│   │   └─ For: agent-test-data
│   │   └─ Generates: Names, emails, addresses, phone numbers
│   │
│   ├─ uuid 9.0.1
│   │   └─ For: All agents (generating unique IDs)
│   │
│   ├─ axios 1.6.2
│   │   └─ For: HTTP requests in agents
│   │   └─ Used by: agent-connector, agent-login
│   │
│   └─ dotenv 16.3.1
│       └─ For: Loading .env file into process.env
│
├─ DOM & CODE ANALYSIS
│   ├─ cheerio 1.0.0-rc.12
│   │   └─ For: agent-dom-analyzer, DOM parsing
│   │   └─ Strategy: Server-side jQuery-like selectors
│   │
│   ├─ jsdom 23.0.1
│   │   └─ For: Virtual DOM simulation
│   │   └─ Used by: agent-explorer, agent-dom-analyzer
│   │
│   └─ diff 5.1.0
│       └─ For: agent-dom-analyzer
│       └─ Compares: DOM structures, elements
│
├─ SQL HANDLING
│   ├─ sql-bricks 3.6.2
│   │   └─ For: agent-sql-query-builder
│   │   └─ Features: Programmatic SQL query building
│   │
│   └─ sql-parser-cst 2.3.2
│       └─ For: agent-sql-query-builder
│       └─ Features: SQL parsing, AST analysis
│
├─ LOGGING
│   └─ pino 8.17.2
│       └─ For: Structured logging in all agents
│       └─ Features: JSON logs, performance optimization
│
└─ PACKAGE MANAGEMENT
    └─ npm workspaces
        └─ Workspace roots: ["packages/*", "apps/*"]


Per-Agent Technology Stack:

agent-connector
├─ Dependencies: axios, dotenv, pino
└─ Reads: config, .env, Credentials.xml

agent-login
├─ Dependencies: axios, openai/@anthropic-ai (optional)
└─ Handles: OAuth, REST auth, token management

agent-catalog
├─ Dependencies: fs (Node.js), pino
└─ Scans: appModules/utils

agent-orchestrator
├─ Dependencies: pino
└─ Plans: Execution sequence

agent-functional
├─ Dependencies: pino, axios
└─ Tests: Business logic

agent-test-plan
├─ Dependencies: pino, uuid
└─ Generates: VSTP documents

agent-ai-planner ⭐
├─ Dependencies: openai, @anthropic-ai/sdk, axios
└─ LLM: Chat completion for test planning

agent-test-data ⭐
├─ Dependencies: @faker-js/faker, uuid
└─ Generates: Realistic test data

agent-explorer
├─ Dependencies: @playwright/test, axios, pino
└─ Tools: Playwright inspector, CDP

agent-dom-analyzer ⭐
├─ Dependencies: cheerio, jsdom, diff, pino
└─ Compares: DOM structures

agent-codegen
├─ Dependencies: @playwright/test, typescript, pino
└─ Generates: *.spec.ts files

agent-sql-query-builder 🔒
├─ Dependencies: sql-bricks, sql-parser-cst, pino
└─ Validates: SQL queries (SELECT-only)

agent-codemod
├─ Dependencies: typescript, pino
└─ Transforms: Code AST

agent-qa-gate
├─ Dependencies: pino, axios
└─ Validates: Code quality

agent-self-healing ⭐
├─ Dependencies: pino, string-similarity (implicit)
└─ Repairs: Broken selectors

agent-failure-analyzer ⭐
├─ Dependencies: openai, @anthropic-ai/sdk, pino
└─ Analyzes: Test failures with LLM

agent-healer
├─ Dependencies: pino
└─ Updates: *.spec.ts selectors

agent-report-composer
├─ Dependencies: pino, handlebars (implicit)
└─ Generates: HTML reports

agent-test-coverage ⭐
├─ Dependencies: pino, uuid
└─ Maps: Tests to requirements
```

---

## 📈 Summary: What Links to What

### Input Sources → Processing Agents → Output Destinations

| INPUT | AGENT | OUTPUT |
|-------|-------|--------|
| .env, config/ | agent-connector | connection-config.json |
| connection-config, credentials | agent-login | auth-token |
| appModules/utils | agent-catalog | utilities.json |
| utilities, REQUIREMENTS | agent-orchestrator | execution-plan.json |
| execution-plan | agent-functional | test-results.json |
| test-results, REQUIREMENTS | agent-test-plan | *.vstp.json |
| REQUIREMENTS, LLM | agent-ai-planner ⭐ | ai-generated-test-plan.json |
| Data patterns | agent-test-data ⭐ | generated-data.json |
| App URL, auth | agent-explorer | elements.json |
| DOM snapshots | agent-dom-analyzer ⭐ | dom-diff.json |
| VSTP, elements, data | + SQL check | *.spec.ts, validation-report |
| *.spec.ts | agent-codemod | Refactored *.spec.ts |
| *.spec.ts | agent-qa-gate | qa-gate-report.json |
| *.spec.ts | PLAYWRIGHT | results.json |
| results, broken tests | agent-self-healing ⭐ | healing-strategies.json |
| results | agent-failure-analyzer ⭐ | failure-report.json |
| healing-strategy | agent-healer | Updated *.spec.ts |
| all results, logs | agent-report-composer | HTML/JSON reports |
| results, REQUIREMENTS | agent-test-coverage ⭐ | coverage-matrix.json |

---

## 🎯 Quick Reference: Total Connections

- **19 Agents** (12 original + 6 Phase 2 + 1 Phase 2.5)
- **4 Execution Layers** (Planning → Discovery → Generation → Execution)
- **2 Intelligence Layers** (Healing & Analysis)
- **1 Reporting Layer**
- **20 Packages** (1 core + 19 agents)
- **11+ Primary Artifacts** (json, html, spec files)
- **50+ Technology Dependencies**
- **Sequential + Parallel** execution paths
- **LLM Integration** (OpenAI, Anthropic)
- **Zero Hardcoding** (All config from environment)

---

**Document Version**: 1.0  
**Created**: March 7, 2026  
**Framework Version**: 1.0.0  
**Last Agent Addition**: agent-sql-query-builder (Phase 2.5)
