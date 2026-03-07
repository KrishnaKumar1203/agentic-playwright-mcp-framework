# Quick Reference Guide - Architecture at a Glance

## 🎯 One-Page Architecture Overview

```
INPUT → CONFIG AGENTS → PLANNING AGENTS → DISCOVERY AGENTS → GENERATION AGENTS → 
  PLAYWRIGHT → INTELLIGENCE AGENTS → REPORTING AGENTS → OUTPUT
```

---

## 📊 21 Agents Quick Reference

### Layer 1: Configuration & Connectivity (4 Agents)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 1 | agent-connector | Resolve connections | env config | connection-config.json |
| 2 | agent-login | Authenticate user | connection + creds | auth-token |
| 3 | agent-catalog | Discover services | appModules/utils | utilities.json |
| 4 | agent-orchestrator | Plan workflow | utilities + reqs | execution-plan.json |

### Layer 2: Planning & Data (3 Agents)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 5 | agent-functional | Test business logic | execution-plan | test-results.json |
| 6 | agent-test-plan | Generate VSTP | test-results + reqs | *.vstp.json |
| 7 | agent-ai-planner ⭐ | AI test planning | REQUIREMENTS.md + LLM | ai-generated-test-plan.json |
| 8 | agent-test-data ⭐ | Generate test data | Data patterns | generated-data.json |

### Layer 3: Discovery (2 Agents)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 9 | agent-explorer | Find UI elements | App URL + auth | elements.json |
| 10 | agent-dom-analyzer ⭐ | Detect DOM changes | Old/new DOM | dom-diff.json |

### Layer 4: Generation & Validation (4 Agents)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 11 | agent-codegen | Generate test code | VSTP + elements | *.spec.ts files |
| 12 | agent-sql-query-builder 🔒 | Validate SQL | SQL queries | validation-report.json |
| 13 | agent-codemod | Refactor code | *.spec.ts | Refactored *.spec.ts |
| 14 | agent-qa-gate | Validate quality | *.spec.ts | qa-gate-report.json |

### Layer 6: Intelligence (3 Agents)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 15 | agent-self-healing ⭐ | Auto-repair selectors | Failed tests | healing-strategies.json |
| 16 | agent-failure-analyzer ⭐ | Analyze failures | Test failures + LLM | failure-analysis.json |
| 17 | agent-healer | Update selectors | Healing strategy | Updated *.spec.ts |

### Layer 7: Reporting (2 Agents)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 18 | agent-report-composer | Generate reports | All results + logs | HTML/JSON reports |
| 19 | agent-test-coverage ⭐ | Coverage analysis | Results + reqs | coverage-matrix.json |

### Layer 8: Infrastructure & DevOps (1 Agent)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 20 | agent-dev-ops 🔧 | DevOps automation | CI/CD specs | operation-results.json |

### Layer 9: API Management (1 Agent)
| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 21 | agent-api-gateway 🔌 | API gateway & testing | API requests | request-response.json |

---

## 🔗 Critical Linkages (Who Calls Whom)

```
connector → login → catalog → orchestrator → functional → test-plan → codegen → codemod → qa-gate → PLAYWRIGHT
                    ↑                                                    ↓
                    └─ LLM APIs (openai/anthropic) ← ai-planner, failure-analyzer
                                                          ↓
                                                    test-data (Faker.js)
                                                          ↓
                                                    explorer + dom-analyzer
                                                          ↓
                                      [codegen calls sql-query-builder for validation] 🔒
                                                          ↓
                                                      PLAYWRIGHT
                                                          ↓
                                    ┌─ self-healing ← [on failure]
                                    ├─ failure-analyzer ← [on failure]
                                    └─ healer ← [if high confidence]
                                                          ↓
                                              report-composer → test-coverage
```

---

## 📁 Directory Linkages

```
config/
├── environments/ISB_*.properties  → Read by: Every agent
├── credentials/Credentials.xml    → Used by: login, explorer, PLAYWRIGHT
├── urls/Application_*.xlsx        → Used by: explorer, PLAYWRIGHT
└── path.properties                → Used by: All agents (artifact paths)

appModules/
└── utils/*.ts                     → Scanned by: agent-catalog
                                   → Used by: agent-functional

artifacts/ (Generated)
├── resolved/                      ← agent-connector
├── catalog/                       ← agent-catalog
├── vstp/                          ← agent-test-plan, agent-ai-planner
├── test-data/                     ← agent-test-data
├── object-repository/             ← agent-explorer
├── dom-diff/                      ← agent-dom-analyzer
├── sql-queries/                   ← agent-sql-query-builder
├── qa-gate/                       ← agent-qa-gate
├── healing/                       ← agent-self-healing, agent-healer
├── failure-analysis/              ← agent-failure-analyzer
├── coverage/                      ← agent-test-coverage
├── reports/                       ← agent-report-composer
├── devops/                        ← agent-dev-ops
├── api-gateway/                   ← agent-api-gateway
├── results/                       ← PLAYWRIGHT
└── logs/                          ← All agents

packages/
├── agents-core/                   ← Base class for all 21 agents
├── agent-*/ (21 packages)         ← Each agent is independent package
└── All linked via npm workspaces

apps/
└── example-webapp-tests/
    ├── tests/generated/           ← Generated by: agent-codegen
    │   └── *.spec.ts              ← Executed by: PLAYWRIGHT
    ├── page-objects/              ← Generated by: agent-codegen
    └── playwright.config.ts
```

---

## 🔄 Execution Flow (Step by Step)

### Step 1: Configuration Phase
```
Load .env    → config/environments/{ENV}.properties
            → config/credentials/Credentials.xml
            → config/path.properties
            → config/urls/*.xlsx
            → appModules/utils/*
```

### Step 2: Connection Phase
```
agent-connector → connection-config.json
                ↓
agent-login → auth-token
```

### Step 3: Discovery Phase
```
agent-catalog → utilities.json
                ↓
agent-orchestrator → execution-plan.json
                     ↓
agent-functional → test-results.json
```

### Step 4: Planning Phase (Parallel)
```
[Branch A]                      [Branch B]                   [Branch C]
agent-test-plan     agent-ai-planner ⭐ (LLM)      agent-test-data
(VSTP)              (AI-generated VSTP)              (Faker.js data)
    ↓                           ↓                         ↓
  *.vstp.json    ai-generated-test-plan.json    generated-data.json
```

### Step 5: UI Discovery Phase (Parallel)
```
agent-explorer → elements.json (Object Repository)
                         ↓
agent-dom-analyzer → dom-diff.json (Change detection)
```

### Step 6: Code Generation Phase
```
agent-codegen
  ├─ Input: *.vstp.json
  ├─ Input: elements.json
  ├─ Input: generated-data.json
  │
  ├─→ Calls: agent-sql-query-builder 🔒 (SQL validation)
  │           │
  │           └─→ Returns: validation-report.json
  │
  └─ Output: *.spec.ts files
```

### Step 7: Quality Phase
```
agent-codemod → refactor code
                    ↓
agent-qa-gate → validate + gate decision
                    ↓
            IF PASS: Proceed to execution
            IF FAIL: Stop and report
```

### Step 8: Execution Phase
```
PLAYWRIGHT
  ├─ Input: *.spec.ts files
  ├─ Runs: Chrome, Firefox, WebKit
  └─ Output: results.json, screenshots/, videos/
```

### Step 9: Deployment & Infrastructure Phase
```
agent-dev-ops ← Handles post-test deployment
  ├─ Docker build & push (Containerize application)
  ├─ Git commit & push (Version control integration)
  ├─ Jenkins trigger (CI/CD pipeline)
  └─ Postman testing (API validation)
      └─ Output: docker images, deployment logs
```

### Step 10: API Management & Monitoring Phase
```
agent-api-gateway ← Manages APIs in deployed environment
  ├─ Route API requests intelligently
  ├─ Cache responses for performance
  ├─ Rate limit endpoints
  ├─ Generate API documentation
  ├─ Test API endpoints
  ├─ Monitor health & metrics
  └─ Output: request-response.json, api-metrics.json, swagger-docs.json
```

### Step 11: Intelligence Phase (On Failure)
```
[Branch A]                          [Branch B]
agent-self-healing              agent-failure-analyzer
(String similarity)             (LLM analysis)
      ↓                                ↓
healing-strategies.json         failure-analysis.json
      ↓                                ↓
agent-healer (if confidence > 80%)   Reports
      ↓
Update *.spec.ts
      ↓
Re-run PLAYWRIGHT
```

### Step 12: Reporting Phase
```
agent-report-composer
  ├─ Aggregate: All results, logs, artifacts
  └─ Generate: HTML reports
                    ↓
agent-test-coverage
  ├─ Map: Tests to requirements
  └─ Generate: Coverage matrix + traceability
                    ↓
              Final Output
              (HTML, JSON, CSV)
```

---

## 🔐 Key Security Features

### Agent: agent-sql-query-builder 🔒
- **Purpose**: Prevent data modification in test queries
- **Rule**: SELECT queries ONLY
- **Blocks**: DELETE, INSERT, UPDATE, DROP, CREATE, ALTER, TRUNCATE, GRANT, REVOKE, EXEC
- **Also Detects**: 
  - SQL injection patterns
  - Unparameterized queries
  - Performance issues (SELECT *, missing LIMIT)

### Where It's Called
```
agent-codegen → (generates SQL) → agent-sql-query-builder
                                      ↓
                        ┌─────────────┴──────────────┐
                        │                            │
                    Safe SQL?                    Dangerous SQL?
                        ↓                            ↓
                    Approve                    Block + Report
                        ↓                            ↓
                  Include in spec             Halt generation
```

---

## 💾 Artifact Types & Formats

| Artifact Type | Format | Created By | Used By |
|---------------|--------|-----------|---------|
| connection-config | JSON | agent-connector | agent-login, explorer, PLAYWRIGHT |
| auth-token | JSON | agent-login | catalog, functional, explorer |
| utilities.json | JSON | agent-catalog | orchestrator, functional |
| execution-plan | JSON | agent-orchestrator | agent-functional |
| test-results | JSON | agent-functional | test-plan, report-composer |
| *.vstp.json | JSON | agent-test-plan | agent-codegen |
| ai-generated-test-plan | JSON | agent-ai-planner | agent-codegen |
| generated-data.json | JSON | agent-test-data | agent-codegen |
| elements.json | JSON | agent-explorer | agent-codegen, dom-analyzer |
| dom-diff.json | JSON | agent-dom-analyzer | Reports |
| *.spec.ts | TypeScript | agent-codegen | agent-codemod → agent-qa-gate → PLAYWRIGHT |
| validation-report.json | JSON | agent-sql-query-builder | agent-codegen caller |
| qa-gate-report | JSON | agent-qa-gate | PLAYWRIGHT, reports |
| results.json | JSON | PLAYWRIGHT | self-healing, failure-analyzer, composer |
| healing-strategies | JSON | agent-self-healing | agent-healer |
| failure-analysis | JSON | agent-failure-analyzer | Reports |
| Updated *.spec.ts | TypeScript | agent-healer | PLAYWRIGHT (next run) |
| summary.html | HTML | agent-report-composer | Final output |
| detail.html | HTML | agent-report-composer | Final output |
| coverage-matrix | JSON | agent-test-coverage | Final output |
| traceability.json | JSON | agent-test-coverage | Requirements mapping |

---

## 🛠️ Technology Quick Look

| Technology | Purpose | Used In |
|-----------|---------|---------|
| Node.js 18+ | Runtime | Everything |
| TypeScript 5.3+ | Type safety | All code |
| Playwright 1.40+ | Test execution | PLAYWRIGHT runner |
| npm workspaces | Package management | Monorepo structure |
| Pino 8.17+ | Structured logging | All agents |
| OpenAI SDK 4.52+ | LLM integration | ai-planner, failure-analyzer |
| Anthropic SDK 0.20+ | LLM integration | ai-planner (alternative), failure-analyzer |
| Faker.js 8.3+ | Test data | agent-test-data |
| Cheerio 1.0+ | DOM parsing | agent-dom-analyzer |
| JSDOM 23+ | Virtual DOM | explorer, dom-analyzer |
| Diff 5.1+ | Diff comparison | agent-dom-analyzer |
| SQL-Bricks 3.6+ | SQL building | agent-sql-query-builder |
| SQL-Parser-CST 2.3+ | SQL parsing | agent-sql-query-builder |
| UUID 9.0+ | ID generation | All agents |
| Axios 1.6+ | HTTP requests | connector, login, functional |
| Dotenv 16.3+ | Env loading | Configuration |

---

## 🔑 Configuration Variables

```
ENVIRONMENT=ISB_DEV|ISB_QA|ISB_UAT|ISB_PROD
LLM_PROVIDER=openai|anthropic
OPENAI_API_KEY={key}
ANTHROPIC_API_KEY={key}
APP_URL={url}
APP_USERNAME={from Credentials.xml}
APP_PASSWORD={from Credentials.xml}
DATABASE_HOST={host}
DATABASE_PORT={port}
DATABASE_NAME={name}
DATABASE_USER={user}
DATABASE_PASSWORD={password}
ARTIFACTS_PATH=./artifacts
LOGS_PATH=./artifacts/logs
BROWSER_TYPE=chromium|firefox|webkit
ENABLE_SQL_VALIDATION=true
ENABLE_HEALING=true
ENABLE_DOM_ANALYSIS=true
PARALLEL_EXECUTION=true
```

---

## 🎬 Running the Pipeline

### Full Pipeline
```bash
npm run pipeline
```
Executes all stages: Config → Connection → Planning → Discovery → Generation → Execution → Intelligence → Reporting

### Individual Commands
```bash
npm run build           # Build all packages
npm run test           # Test all packages
npm run dev            # Dev mode (watch)
npm run clean          # Clear artifacts
npm run reports        # Generate reports only
```

### Environment-Specific
```bash
export ENVIRONMENT=ISB_DEV      # Development
export ENVIRONMENT=ISB_QA       # QA
export ENVIRONMENT=ISB_UAT      # UAT
export ENVIRONMENT=ISB_PROD     # Production

npm run pipeline
```

---

## 📋 Dependency Summary

- **Total Agents**: 19
- **Total Packages**: 20 (core + 19 agents)
- **Critical Linkages**: 50+
- **Artifact Types**: 21
- **Primary LLM APIs**: 2 (OpenAI, Anthropic)
- **Configuration Files**: 6
- **Technology Dependencies**: 15+
- **Execution Layers**: 7
- **Sequential + Parallel**: Mixed flow with 3 parallel branches
- **Zero Hardcoding**: All from environment or config files

---

## 📞 Agent Inter-Dependencies Cheat Sheet

```
Depends On          →  Used By

connector          →  login, explorer, PLAYWRIGHT
login              →  catalog, functional, explorer, PLAYWRIGHT
catalog            →  orchestrator, functional
orchestrator       →  functional
functional         →  test-plan, report-composer
test-plan          →  codegen
ai-planner         →  codegen (alternative input)
test-data          →  codegen
explorer           →  codegen, dom-analyzer
dom-analyzer       →  (reports)
codegen            →  codemod (calls sql-builder)
                   →  codemod → qa-gate → PLAYWRIGHT
sql-query-builder  →  codegen (called during generation)
codemod            →  qa-gate
qa-gate            →  PLAYWRIGHT (if passes)
PLAYWRIGHT         →  self-healing (on failure)
                   →  failure-analyzer (on failure)
                   →  report-composer (always)
self-healing       →  healer (if high confidence)
healer             →  PLAYWRIGHT (next run)
failure-analyzer   →  (reports)
report-composer    →  test-coverage
test-coverage      →  (final output)
```

---

## 🎯 Phased Agent Evolution

### Phase 1: Original 12 Agents (Foundation)
1. agents-core
2. agent-connector
3. agent-login
4. agent-catalog
5. agent-orchestrator
6. agent-functional
7. agent-test-plan
8. agent-explorer
9. agent-codegen
10. agent-qa-gate
11. agent-report-composer
12. agent-codemod

### Phase 2: AI-Driven 6 Agents (Intelligence)
13. agent-ai-planner ⭐
14. agent-test-data ⭐
15. agent-dom-analyzer ⭐
16. agent-self-healing ⭐
17. agent-failure-analyzer ⭐
18. agent-test-coverage ⭐

### Phase 2.5: Security Agent (1 Agent)
19. agent-sql-query-builder 🔒

**Plus Utility Agents**:
- agent-healer (Referenced in documentation, works with self-healing)

---

**Last Updated**: March 7, 2026  
**Version**: 1.0.0  
**Total Agents**: 19 across 7 layers
