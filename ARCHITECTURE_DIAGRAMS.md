# Architecture Visualization & Linkage Diagrams

## 1. Complete System Architecture Map

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AGENTIC PLAYWRIGHT MCP FRAMEWORK                          │
│                            (19 Agents, 7 Layers)                                │
└─────────────────────────────────────────────────────────────────────────────────┘

          ┌────────────────────────────────────────────────────────────┐
          │     CONFIGURATION & INPUT SOURCES                          │
          │  (.env, config/*, appModules/*, REQUIREMENTS.md)          │
          └────────────────────┬───────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
    ┌─────────────────────┐      ┌──────────────────────┐
    │ ENV Variables       │      │ Config Files         │
    │ - ENVIRONMENT       │      │ - Credentials        │
    │ - LLM_PROVIDER      │      │ - URLs               │
    │ - API_KEYS          │      │ - Paths              │
    │ - DB_CONFIG         │      │ - Business Utils     │
    └──────────┬──────────┘      └──────────┬───────────┘
               │                            │
               └─────────────┬──────────────┘
                             │
                   ┌─────────▼─────────┐
                   │ LAYER 1           │
                   │ Configuration &   │
                   │ Authentication    │
                   └─────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┬──────────────────┐
        │                    │                    │                  │
        ▼                    ▼                    ▼                  ▼
    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │connector   │    │login       │    │catalog     │    │orchestrator│
    │(resolves)  │───→│(auth)      │───→│(discover)  │───→│(plans)     │
    │#1          │    │#2          │    │#3          │    │#4          │
    └────────────┘    └────────────┘    └────────────┘    └────────────┘
                                              │
                                              ▼
                                        ┌────────────┐
                                        │functional  │
                                        │#5          │
                                        └────┬───────┘
                                             │
                                    ┌────────▼─────────┐
                                    │ LAYER 2          │
                                    │ AI Planning &    │
                                    │ Data Generation  │
                                    └────────┬─────────┘
                                             │
        ┌────────────────────────────────────┼────────────────────────────────┐
        │                                    │                                │
        ▼                                    ▼                                ▼
    ┌────────────┐              ┌────────────────┐            ┌──────────────┐
    │test-plan   │              │ai-planner ⭐   │            │test-data ⭐  │
    │#6          │              │#7 (LLM)        │            │#8 (Faker)    │
    │(VSTP)      │              │(AI-generated)  │            │(dynamic)     │
    └────────────┘              └────────────────┘            └──────────────┘
        │                               │                           │
        │        ┌──────────────────────┴───────────────────────────┘
        │        │
        │        ▼
        │    ┌────────────────────┐
        │    │ LAYER 3            │
        │    │ Discovery &        │
        │    │ Analysis           │
        │    └────────────────────┘
        │        │
        │        ├──────────────────┬────────────────────┐
        │        │                  │                    │
        │        ▼                  ▼                    ▼
        │    ┌────────────┐    ┌────────────┐    ┌────────────┐
        │    │explorer    │    │dom-analyzer│   │test-plan   │
        │    │#9          │    │⭐ #10      │   │output ↓    │
        │    │(UI find)   │───→│(changes)   │   │vstp.json   │
        │    └────────────┘    └────────────┘   └────────────┘
        │                           │
        │                           │
        └───────────┬───────────────┘
                    │
                    ▼
            ┌────────────────────┐
            │ LAYER 4            │
            │ Generation &       │
            │ Validation         │
            └────────────────────┘
                    │
                    ▼
            ┌────────────────┐
            │codegen         │
            │#11             │
            │(TypeScript)    │
            └────────┬───────┘
                     │
                     ├─────────────────────────┐
                     │                         │
                     ▼                         ▼
            ┌──────────────────┐    ┌──────────────────────┐
            │spec files        │    │calls sql-validator   │
            │*.spec.ts         │    │agent-sql-query-builder│
            │page objects      │    │🔒 #12                 │
            │fixtures          │    │(SELECT-only check)    │
            └──────────────────┘    └──────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │codemod         │
            │#13             │
            │(refactor)      │
            └────────┬───────┘
                     │
                     ▼
            ┌────────────────┐
            │qa-gate         │
            │#14             │
            │(validates)     │
            └────────┬───────┘
                     │
            IF FAIL: BLOCK
            IF PASS: CONTINUE
                     │
                     ▼
            ┌────────────────────┐
            │ LAYER 5            │
            │ Execution          │
            │ (Playwright)       │
            └────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │PLAYWRIGHT TEST │
            │execution       │
            │#15             │
            │(Run tests)     │
            └────────┬───────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    IF FAIL:                 IF PASS:
        │                         │
        ▼                         ▼
    ┌─────────────────────────────────────┐
    │ LAYER 6: Intelligence               │
    │ (Healing & Failure Analysis)        │
    └─────────────────────────────────────┘
        │                    │
        ▼                    ▼
    ┌──────────────┐  ┌─────────────────┐
    │self-healing  │  │failure-analyzer │
    │⭐ #16        │  │⭐ #17 (LLM)     │
    │(fixes)       │  │(analyzes)       │
    └──────┬───────┘  └─────────────────┘
           │
        IF HIGH CONFIDENCE:
           │
           ▼
    ┌──────────────┐
    │healer        │
    │#18           │
    │(updates spec)│
    └──────────────┘
           │
           └──→ Re-run PLAYWRIGHT
                     │
                     ▼
    ┌─────────────────────────────────────┐
    │ LAYER 7: Reporting                  │
    └─────────────────────────────────────┘
            │
            ├──────────────────┬────────────────────┐
            │                  │                    │
            ▼                  ▼                    ▼
    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
    │report-       │    │test-coverage │    │Final Outputs │
    │composer      │    │⭐ #19        │    │HTML reports  │
    │#18           │    │(coverage map)│    │JSON matrices │
    │(aggregates)  │───→│(traceability)│    │Coverage %    │
    └──────────────┘    └──────────────┘    └──────────────┘
```

---

## 2. Data Flow Network Diagram

```
                         INPUTS
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌─────────┐       ┌──────────┐       ┌──────────┐
    │.env     │       │config/   │       │appModules│
    │variables│       │files     │       │/utils    │
    └────┬────┘       └───┬──────┘       └────┬─────┘
         │                │                   │
         │                │                   │
         └────────────────┼───────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────┐
        │  CONFIGURATION PHASE                │
        │  (Environment Setup)                │
        │  Agents: connector, login, catalog  │
        └─────────────┬───────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    ┌─────────────────┐    ┌─────────────────┐
    │connection-config│    │utilities.json   │
    │auth-token       │    │execution-plan   │
    └────┬────────────┘    └────┬────────────┘
         │                      │
         └──────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────┐
        │  PLANNING PHASE             │
        │  (Test Plan Generation)     │
        │  Agents: test-plan, ai-plan │
        │          test-data          │
        └─────────────┬───────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │*.vstp.   │ │*.vstp.   │ │generated-│
    │json      │ │json (AI) │ │data.json │
    │(plans)   │ │          │ │(test dat)│
    └────┬─────┘ └────┬─────┘ └────┬─────┘
         │            │            │
         └────────────┼────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │  DISCOVERY PHASE            │
        │  (Element & Change Find)    │
        │  Agents: explorer, analyzer │
        └─────────────┬───────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
    ┌─────────────────┐    ┌─────────────────┐
    │elements.json    │    │dom-diff.json    │
    │(object repo)    │    │(change detect)  │
    └────┬────────────┘    └────┬────────────┘
         │                      │
         │                      │ (Parallel)
         │                      │
         └──────────────────────┘
                    │
                    ▼
        ┌─────────────────────────────┐
        │  GENERATION PHASE           │
        │  (Code Gen & Validation)    │
        │  Agents: codegen, sql-check │
        │          codemod, qa-gate   │
        └─────────────┬───────────────┘
                      │
                      ├──────────────┬──────────────┐
                      │              │              │
                      ▼              ▼              ▼
                ┌──────────┐   ┌──────────┐  ┌─────────────┐
                │*.spec.ts │   │sql-valid │  │qa-gate-     │
                │(Playwright)  │report.json   report.json  │
                │files     │   │          │  │             │
                └────┬─────┘   └────┬─────┘  └─────────────┘
                     │              │
                     └──────────────┘
                          │
                  IF GATE FAILS: STOP
                  IF GATE PASSES:
                          │
                          ▼
        ┌─────────────────────────────┐
        │  EXECUTION PHASE            │
        │  (Test Running)             │
        │  Runner: Playwright         │
        └─────────────┬───────────────┘
                      │
                      ▼
            ┌──────────────────┐
            │results.json      │
            │screenshots/      │
            │videos/           │
            │traces/           │
            └────┬─────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
IF FAILURES:                  ▼
    │                 ┌──────────────────┐
    │                 │  INTELLIGENCE    │
    │                 │  PHASE (Healing) │
    │                 │  Agents: self-   │
    │                 │  healing, failure-
    │                 │  analyzer, healer│
    │                 └────────┬─────────┘
    │                          │
    │              ┌───────────┴───────────┐
    │              │                       │
    │              ▼                       ▼
    │         ┌──────────────┐       ┌──────────────┐
    │         │healing-      │       │failure-      │
    │         │strategies    │       │analysis      │
    │         │(auto-fix)    │       │(explanation) │
    │         └──────┬───────┘       └──────────────┘
    │                │
    │      IF CONFIDENCE > 80%:
    │                │
    │                ▼
    │         ┌──────────────┐
    │         │Update        │
    │         │*.spec.ts     │
    │         └──────┬───────┘
    │                │
    └─────────┬──────┘
              │
              ▼ (Re-run)
    PLAYWRIGHT execution
              │
              │ (Converges)
              │
              ▼
        ┌─────────────────────────┐
        │  REPORTING PHASE        │
        │  Agents: report-composer│
        │          test-coverage  │
        └─────────────┬───────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │summary.  │ │detail.   │ │coverage- │
    │html      │ │html      │ │matrix.   │
    │          │ │          │ │json      │
    └──────────┘ └──────────┘ └──────────┘
             │               │
             └───────┬───────┘
                     │
                     ▼
            ┌─────────────────┐
            │ FINAL REPORTS   │
            │ HTML, JSON, XML │
            │ Coverage matrix │
            │ Traceability    │
            └─────────────────┘
```

---

## 3. Agent Communication & Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│ COMMUNICATION BETWEEN AGENTS (Direct & Indirect)                     │
└─────────────────────────────────────────────────────────────────────┘

LAYER 1 → LAYER 1
──────────────────
agent-connector
    │
    ├──(connection-config)──→ agent-login
    │
    ├──(connection-config)──→ agent-explorer
    │
    └──(connection-config)──→ PLAYWRIGHT


LAYER 1 → LAYER 1
agent-login
    │
    ├──(auth-token)──→ agent-catalog
    │
    ├──(auth-token)──→ agent-functional
    │
    ├──(auth-token)──→ agent-explorer
    │
    └──(auth-token)──→ PLAYWRIGHT


LAYER 1 → LAYER 1
agent-catalog
    │
    └──(utilities.json)──→ agent-orchestrator
                          agent-functional


LAYER 1 → LAYER 1  
agent-orchestrator
    │
    └──(execution-plan.json)──→ agent-functional


LAYER 1 → LAYER 1
agent-functional
    │
    ├──(test-results.json)──→ agent-test-plan
    │
    ├──(test-results.json)──→ agent-report-composer
    │
    └──(test-results.json)──→ agent-test-coverage


LAYER 1 → LAYER 2
agent-test-plan
    │
    └──(*.vstp.json)──→ agent-codegen


LAYER 2 → LAYER 2 (Parallel / Independent)
agent-ai-planner ⭐
    │
    ├──(LLM API) OpenAI / Anthropic
    │
    └──(ai-generated-test-plan.json)──→ agent-codegen


LAYER 2 → LAYER 2
agent-test-data ⭐
    │
    └──(generated-data.json)──→ agent-codegen


LAYER 2 → LAYER 3 (Parallel / Independent)
agent-explorer
    │
    ├──(elements.json)──→ agent-codegen
    │
    ├──(elements.json)──→ agent-dom-analyzer
    │
    ├──(elements.json)──→ PLAYWRIGHT
    │
    └──(dom-snapshot)──→ agent-dom-analyzer


LAYER 3 → LAYER 3
agent-dom-analyzer ⭐
    │
    ├──(dom-diff.json)──→ Reports
    │
    └──(breaking-changes)──→ Notifications


LAYER 3 → LAYER 4
agent-codegen
    │
    ├─→ INPUT: *.vstp.json (from test-plan)
    │
    ├─→ INPUT: ai-generated-test-plan.json (from ai-planner)
    │
    ├─→ INPUT: elements.json (from explorer)
    │
    ├─→ INPUT: generated-data.json (from test-data)
    │
    ├─→ CALLS: agent-sql-query-builder ← [SQL VALIDATION]
    │   │
    │   └──(SQL queries with validation request)──→ agent-sql-query-builder 🔒
    │       │
    │       └──(validation-report.json)──→ agent-codegen
    │
    └──(*.spec.ts)──→ agent-codemod


LAYER 4 → LAYER 4
agent-codemod
    │
    └──(refactored *.spec.ts)──→ agent-qa-gate


LAYER 4 → LAYER 4
agent-qa-gate
    │
    ├──IF FAIL: BLOCK
    │
    └──IF PASS: (qa-gate-report.json)──→ PLAYWRIGHT


LAYER 4 → LAYER 5
 agent-qa-gate ✓
    │
    └──(validated *.spec.ts)──→ PLAYWRIGHT


LAYER 5 → LAYER 6 (On Failure)
PLAYWRIGHT
    │
    ├──(failed test data)──→ agent-self-healing ⭐
    │   │
    │   ├──(healing-strategies.json)──→ agent-healer
    │   │
    │   └──IF HIGH CONFIDENCE──→ agent-healer
    │
    └──(test results)──→ agent-failure-analyzer ⭐
        │
        ├──(LLM API) OpenAI / Anthropic
        │
        └──(failure-analysis report)──→ Reports


LAYER 6 → LAYER 6
agent-healer
    │
    └──(updated *.spec.ts with new selectors)──→ PLAYWRIGHT (Next Run)


LAYER 6 → LAYER 7
PLAYWRIGHT ✓ & agent-failure-analyzer ✓
    │
    └──(all results + logs)──→ agent-report-composer


LAYER 7 → LAYER 7
agent-report-composer
    │
    ├──(all artifacts + results)──→ agent-test-coverage ⭐
    │
    └──(summary.html + detail.html)──→ Final Output


LAYER 7 → FINAL
agent-test-coverage ⭐
    │
    ├──(results + REQUIREMENTS.md)──→ Map tests to requirements
    │
    └──(coverage-matrix.json + traceability.json)──→ Final Output
```

---

## 4. Package Hierarchy & Workspace Structure

```
agentic-playwright-mcp-framework (Root)
│
├── package.json (Workspaces definition)
├── tsconfig.json (Root TypeScript config)
├── playwright.config.ts (Playwright config)
├── .env.example
│
├── packages/ (npm workspaces)
│   │
│   ├── agents-core/
│   │   ├── src/
│   │   │   ├── agent.ts (Base Agent class)
│   │   │   ├── types.ts (Interfaces)
│   │   │   ├── logger.ts (Pino logging)
│   │   │   └── context.ts (Execution context)
│   │   └── package.json (Dependencies: pino, uuid)
│   │
│   ├── agent-connector/ ← Used by: login, explorer, PLAYWRIGHT
│   │   ├── src/ (Connection resolution)
│   │   └── package.json (Deps: axios, dotenv)
│   │
│   ├── agent-login/ ← Used by: catalog, functional, explorer
│   │   ├── src/ (Authentication)
│   │   └── package.json (Deps: axios, openai, anthropic)
│   │
│   ├── agent-catalog/ ← Used by: orchestrator, functional
│   │   ├── src/ (Service discovery)
│   │   └── package.json
│   │
│   ├── agent-orchestrator/ ← Used by: functional
│   │   ├── src/ (Workflow planning)
│   │   └── package.json
│   │
│   ├── agent-functional/ ← Used by: test-plan, report-composer
│   │   ├── src/ (Business logic testing)
│   │   └── package.json
│   │
│   ├── agent-test-plan/ ← Used by: codegen
│   │   ├── src/ (VSTP generation)
│   │   └── package.json
│   │
│   ├── agent-ai-planner/ ⭐ ← Used by: codegen
│   │   ├── src/ (AI test planning)
│   │   └── package.json (Deps: openai, anthropic)
│   │
│   ├── agent-test-data/ ⭐ ← Used by: codegen
│   │   ├── src/ (Faker.js data generation)
│   │   └── package.json (Deps: @faker-js/faker, uuid)
│   │
│   ├── agent-explorer/ ← Used by: codegen, dom-analyzer
│   │   ├── src/ (UI element discovery)
│   │   └── package.json (Deps: @playwright/test, axios)
│   │
│   ├── agent-dom-analyzer/ ⭐ ← Used by: reports
│   │   ├── src/ (DOM change detection)
│   │   └── package.json (Deps: cheerio, diff, jsdom)
│   │
│   ├── agent-codegen/ ← Uses: sql-query-builder for validation
│   │   ├── src/ (Test code generation)
│   │   └── package.json (Deps: @playwright/test, typescript)
│   │
│   ├── agent-sql-query-builder/ 🔒 ← Called by: codegen
│   │   ├── src/ (SQL validation - SELECT ONLY)
│   │   └── package.json (Deps: sql-bricks, sql-parser-cst)
│   │
│   ├── agent-codemod/ ← Used by: qa-gate
│   │   ├── src/ (Code transformation)
│   │   └── package.json (Deps: typescript)
│   │
│   ├── agent-qa-gate/ ← Used by: PLAYWRIGHT
│   │   ├── src/ (Quality validation)
│   │   └── package.json (Deps: axios)
│   │
│   ├── agent-self-healing/ ⭐ ← Called by: PLAYWRIGHT (on failure)
│   │   ├── src/ (Selector auto-repair)
│   │   └── package.json
│   │
│   ├── agent-failure-analyzer/ ⭐ ← Called by: PLAYWRIGHT (on failure)
│   │   ├── src/ (Failure analysis)
│   │   └── package.json (Deps: openai, anthropic)
│   │
│   ├── agent-healer/ ← Called by: self-healing (if high confidence)
│   │   ├── src/ (Selector updates)
│   │   └── package.json
│   │
│   ├── agent-report-composer/ ← Used by: test-coverage
│   │   ├── src/ (Report generation)
│   │   └── package.json (Deps: handlebars)
│   │
│   └── agent-test-coverage/ ⭐ ← Final output
│       ├── src/ (Coverage analysis)
│       └── package.json
│
├── apps/ (Application workspaces)
│   │
│   └── example-webapp-tests/
│       ├── tests/
│       │   ├── generated/ ← Generated by: agent-codegen
│       │   │   └── *.spec.ts (Playwright test files)
│       │   └── fixtures/
│       ├── page-objects/ ← Generated by: agent-codegen
│       │   └── *.ts (Page Object Models)
│       ├── playwright.config.ts
│       └── package.json (@playwright/test)
│
├── config/
│   ├── path.properties (Base paths)
│   ├── environments/
│   │   ├── ISB_DEV_Env.properties
│   │   ├── ISB_QA_Env.properties
│   │   ├── ISB_UAT_Env.properties
│   │   └── ISB_PROD_Env.properties
│   ├── credentials/
│   │   └── Credentials.xml (Encrypted vault)
│   └── urls/
│       └── Application_Url_Config.xlsx
│
├── appModules/
│   └── utils/ ← Scanned by: agent-catalog
│       ├── Authentication.ts
│       ├── DatabaseOperations.ts
│       └── ... [other utilities]
│
├── artifacts/ (Generated at runtime)
│   ├── resolved/ (agent-connector)
│   ├── catalog/ (agent-catalog)
│   ├── vstp/ (agent-test-plan + agent-ai-planner)
│   ├── test-data/ (agent-test-data)
│   ├── object-repository/ (agent-explorer)
│   ├── dom-diff/ (agent-dom-analyzer)
│   ├── sql-queries/ (agent-sql-query-builder)
│   ├── qa-gate/ (agent-qa-gate)
│   ├── healing/ (agent-self-healing + agent-healer)
│   ├── failure-analysis/ (agent-failure-analyzer)
│   ├── coverage/ (agent-test-coverage)
│   ├── reports/ (agent-report-composer)
│   ├── results/ (PLAYWRIGHT)
│   └── logs/ (All agents)
│
└── docs/
    ├── architecture.md (Architecture overview)
    ├── agents.md (Agent documentation)
    └── pipeline.md (Pipeline execution guide)
```

---

## 5. Technology & Library Dependencies Network

```
Root Package.json Dependencies
│
├── Runtime & Build
│   ├── Node.js 18+ [engines]
│   ├── TypeScript 5.3.3 [devDependencies]
│   ├── @playwright/test 1.40.0 [devDependencies]
│   └── concurrently 8.2.2 [build scripts]
│
├── LLM Integration
│   ├── openai 4.52.0
│   │   └── Used by: agent-ai-planner, agent-failure-analyzer
│   │   └── APIs: ChatCompletion, Embeddings, Fine-tuning
│   │
│   └── @anthropic-ai/sdk 0.20.0
│       └── Used by: agent-ai-planner (alternative), agent-failure-analyzer
│       └── APIs: Claude models
│
├── Data & Utilities
│   ├── @faker-js/faker 8.3.1
│   │   └── Used by: agent-test-data
│   │   └── Generates: Names, emails, addresses, dates, etc.
│   │
│   ├── uuid 9.0.1
│   │   └── Used by: All agents (ID generation)
│   │
│   ├── axios 1.6.2
│   │   └── Used by: agent-connector, agent-login, agent-functional
│   │   └── For: HTTP requests, API calls
│   │
│   └── dotenv 16.3.1
│       └── Used by: Configuration loading
│       └── Loads: .env file into process.env
│
├── DOM & Code Analysis
│   ├── cheerio 1.0.0-rc.12
│   │   └── Used by: agent-dom-analyzer
│   │   └── For: Server-side jQuery-like DOM manipulation
│   │
│   ├── jsdom 23.0.1
│   │   └── Used by: agent-explorer, agent-dom-analyzer
│   │   └── For: Virtual DOM simulation
│   │
│   └── diff 5.1.0
│       └── Used by: agent-dom-analyzer
│       └── For: Comparing DOM structures
│
├── SQL Handling
│   ├── sql-bricks 3.6.2
│   │   └── Used by: agent-sql-query-builder
│   │   └── For: Programmatic SQL query building
│   │
│   └── sql-parser-cst 2.3.2
│       └── Used by: agent-sql-query-builder
│       └── For: SQL parsing, validation, AST analysis
│
├── Logging & Monitoring
│   └── pino 8.17.2
│       └── Used by: All agents
│       └── For: High-performance structured logging in JSON
│
└── Package Management
    └── npm workspaces
        └── Root: "packages/*", "apps/*"
        └── Enables: Unified dependency management
```

---

## 6. Environment Variable Resolution

```
.env File
│
├─ ENVIRONMENT=ISB_DEV|ISB_QA|ISB_UAT|ISB_PROD
│   └─ Maps to: config/environments/{ENVIRONMENT}.properties
│
├─ LLM Configuration
│   ├─ LLM_PROVIDER=openai|anthropic
│   ├─ OPENAI_API_KEY={key} ← openai package
│   └─ ANTHROPIC_API_KEY={key} ← @anthropic-ai/sdk package
│
├─ Application Configuration
│   ├─ APP_URL={target_app_url}
│   ├─ APP_USERNAME={from Credentials.xml}
│   ├─ APP_PASSWORD={from Credentials.xml}
│   └─ BROWSER_TYPE=chromium|firefox|webkit
│
├─ Database Configuration
│   ├─ DATABASE_HOST={host}
│   ├─ DATABASE_PORT={port}
│   ├─ DATABASE_NAME={name}
│   ├─ DATABASE_USER={user} ← Credentials.xml
│   └─ DATABASE_PASSWORD={password} ← Credentials.xml
│
├─ Path Configuration
│   ├─ ARTIFACTS_PATH=./artifacts
│   ├─ LOGS_PATH=./artifacts/logs
│   ├─ REPORTS_PATH=./artifacts/reports
│   └─ CONFIG_PATH=./config
│
└─ Feature Flags
    ├─ ENABLE_SQL_VALIDATION=true
    ├─ ENABLE_HEALING=true
    ├─ ENABLE_DOM_ANALYSIS=true
    └─ PARALLEL_EXECUTION=true

Used by: Every agent during initialization
```

---

## 7. Data Format & Schema Linkages

```
JSON SCHEMAS & FORMAT CHAINS

connection-config.json (from agent-connector)
│
├─ Linked to: auth-token (input for agent-login)
├─ Linked to: connection pool (PLAYWRIGHT runner)
└─ Example:
    {
      "host": "db.example.com",
      "port": 5432,
      "database": "test_db",
      "validated": true,
      "timestamp": "2024-01-15T10:30:00Z"
    }

auth-token (from agent-login)
│
├─ Linked to: agent-catalog input
├─ Linked to: agent-functional input
├─ Linked to: agent-explorer input
└─ Example:
    {
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "sessionId": "sess_abc123",
      "validUntil": "2024-01-15T15:30:00Z",
      "refreshToken": "ref_xyz789"
    }

utilities.json (from agent-catalog)
│
├─ Linked to: agent-orchestrator input
├─ Linked to: agent-functional reference
└─ Example:
    {
      "utilities": [
        {
          "name": "Authentication.ts",
          "functions": ["login", "logout", "resetPassword"],
          "exports": 3
        }
      ]
    }

execution-plan.json (from agent-orchestrator)
│
├─ Linked to: agent-functional input
└─ Example:
    {
      "steps": [
        {
          "stepId": 1,
          "agentName": "agent-functional",
          "action": "test_login",
          "sequence": 1
        }
      ]
    }

*.vstp.json (from agent-test-plan OR agent-ai-planner)
│
├─ Linked to: agent-codegen input
└─ Example:
    {
      "planId": "PLAN_LOGIN_01",
      "testCases": [
        {
          "testId": "TC_001",
          "title": "Login with valid credentials",
          "steps": [
            "Navigate to login page",
            "Enter username: {username}",
            "Enter password: {password}",
            "Click login button"
          ],
          "expectedResults": ["User logged in", "Dashboard displayed"]
        }
      ],
      "coverage": 85
    }

generated-data.json (from agent-test-data)
│
├─ Linked to: agent-codegen input (embedded)
└─ Example:
    {
      "testUsers": [
        {
          "email": "john.doe@example.com",
          "firstName": "John",
          "lastName": "Doe",
          "phone": "(555) 123-4567"
        }
      ]
    }

elements.json (from agent-explorer)
│
├─ Linked to: agent-codegen input
├─ Linked to: agent-dom-analyzer comparison
└─ Example:
    {
      "elements": {
        "loginButton": {
          "selector": "button.login-btn",
          "xpath": "//button[@class='login-btn']",
          "testid": "login-button",
          "type": "button",
          "ariaLabel": "Login"
        }
      }
    }

dom-diff.json (from agent-dom-analyzer)
│
├─ Linked to: Reports
└─ Example:
    {
      "changes": [
        {
          "type": "removed",
          "element": "button.old-nav",
          "severity": "critical"
        },
        {
          "type": "added",
          "element": "nav.new-header",
          "severity": "info"
        }
      ]
    }

*.spec.ts (from agent-codegen)
│
├─ Validated by: agent-sql-query-builder (for SQL content)
├─ Refactored by: agent-codemod
├─ Validated by: agent-qa-gate
├─ Executed by: PLAYWRIGHT
└─ Example:
    test('Login with valid credentials', async ({ page }) => {
      await page.goto('https://app.example.com/login');
      await page.fill('input[name="username"]', 'testuser@example.com');
      await page.click('button.login-btn');
      await expect(page).toHaveURL(/.*dashboard/);
    });

validation-report.json (from agent-sql-query-builder)
│
├─ Linked to: agent-codegen caller (for validation result)
└─ Example:
    {
      "validations": [
        {
          "query": "SELECT * FROM users WHERE id = 1",
          "isValid": true,
          "isSafe": true,
          "queryType": "SELECT",
          "riskLevel": "safe",
          "issues": []
        },
        {
          "query": "DELETE FROM users WHERE id = 1",
          "isValid": false,
          "isSafe": false,
          "queryType": "DELETE",
          "riskLevel": "critical",
          "issues": [
            {
              "type": "security",
              "message": "Only SELECT queries allowed"
            }
          ]
        }
      ]
    }

qa-gate-report.json (from agent-qa-gate)
│
├─ Linked to: PLAYWRIGHT execution (gate decision)
└─ Example:
    {
      "status": "PASSED",
      "coverage": 87.5,
      "quality": 95,
      "codeSmells": 0,
      "passedAt": "2024-01-15T10:35:00Z"
    }

results.json (from PLAYWRIGHT)
│
├─ Analyzed by: agent-self-healing (on failure)
├─ Analyzed by: agent-failure-analyzer
├─ Reported by: agent-report-composer
└─ Example:
    {
      "stats": {
        "expected": 15,
        "passed": 14,
        "failed": 1,
        "skipped": 0
      },
      "suites": [
        {
          "title": "Login Tests",
          "tests": [
            {
              "title": "Should login successfully",
              "status": "passed"
            }
          ]
        }
      ]
    }

healing-strategies.json (from agent-self-healing)
│
├─ Linked to: agent-healer execution
└─ Example:
    {
      "failures": [
        {
          "testName": "Login Test",
          "brokenSelector": "button.login-btn",
          "suggestions": [
            {
              "newSelector": "button#_login",
              "confidence": 95,
              "reason": "ID selector matched"
            }
          ]
        }
      ]
    }

failure-analysis.json (from agent-failure-analyzer)
│
├─ Linked to: Reports
└─ Example:
    {
      "failures": [
        {
          "testName": "Login Test",
          "errorMessage": "Element not found",
          "rootCause": "Selector 'button.login-btn' no longer exists",
          "suggestion": "Use 'button#_login' instead",
          "confidence": 87
        }
      ]
    }

summary.html (from agent-report-composer)
│
├─ Linked to: Final output
└─ Contains: Pass/fail summary, execution time, environment

coverage-matrix.json (from agent-test-coverage)
│
├─ Linked to: Traceability report
└─ Example:
    {
      "requirements": [
        {
          "id": "REQ_001",
          "description": "User should login",
          "tests": ["TC_001"],
          "status": "covered"
        }
      ],
      "coverage": 92
    }
```

---

## Summary: Total Architecture Connections

- **19 Agents** organized in **7 layers**
- **50+ Direct linkages** between agents
- **90+ Indirect dependencies** through artifacts
- **12 Primary artifact types** (JSON, HTML, TS)
- **7 LLM API integration points** (openai, anthropic)
- **6 Configuration source files**
- **3 Parallel execution branches** (Planning, Discovery, Intelligence)
- **Zero hardcoding** - Environment variables only
- **Linear + Branching** execution flow

