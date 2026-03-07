# 🧠 Agentic Playwright MCP Framework

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.40-orange.svg)](https://playwright.dev/)
[![npm workspaces](https://img.shields.io/badge/npm-workspaces-red.svg)](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
[![Agents](https://img.shields.io/badge/Agents-19-brightgreen.svg)](docs/agents.md)
[![AI-Powered](https://img.shields.io/badge/AI--Powered-✓-success.svg)]()
[![SQL Safe](https://img.shields.io/badge/SQL-SELECT--Only-important.svg)]()

A **next-generation, AI-augmented test automation platform** built with Playwright and Model Context Protocol (MCP) for intelligent test planning, generation, execution, and self-healing.

## 🌟 Core Features

✅ **19 Specialized Agents** - Distributed intelligence across 7 architectural layers  
✅ **AI Test Generation** - LLM-powered test plan creation from requirements  
✅ **Dynamic Test Data** - Realistic data generation without hardcoding (Faker.js)  
✅ **Safe SQL Queries** - Validates and generates SELECT-only queries (blocks DELETE/INSERT/UPDATE)  
✅ **Self-Healing Tests** - Automatic selector repair using string similarity  
✅ **Intelligent Failure Analysis** - AI-powered root cause suggestions  
✅ **DOM Change Detection** - Identifies breaking changes in UI structure  
✅ **Requirements Coverage** - Traceability matrix and gap analysis  
✅ **Zero Hardcoding** - All configuration from environment variables  
✅ **Multi-Environment Support** - DEV, QA, UAT, PROD with environment-based config  
✅ **Complete Artifact Pipeline** - Generated artifacts at each stage  

## 🏗️ 7-Layer Architecture

The framework implements a sophisticated layered agentic architecture:

```
Layer 7: Reporting             agent-report-composer, agent-test-coverage
         ↑
Layer 6: Intelligence          agent-self-healing, agent-failure-analyzer
         ↑
Layer 5: Execution             Playwright test runner
         ↑
Layer 4: Generation            agent-codegen (generates .spec.ts)
         ↑
Layer 3: Discovery             agent-explorer, agent-dom-analyzer
         ↑
Layer 2: Planning (AI)         agent-ai-planner (LLM-based), agent-test-data
         ↑
Layer 1: Configuration         Environment variables, credentials, paths
```

### What This Means

- **Layer 1 (Configuration)**: All settings externalized - no hardcoded values
- **Layer 2 (Planning/AI)**: LLM generates test plans from requirements + Faker generates test data
- **Layer 3 (Discovery)**: App exploration and DOM change detection
- **Layer 4 (Generation)**: Transform plans into Playwright code automatically
- **Layer 5 (Execution)**: Run tests with Playwright
- **Layer 6 (Intelligence)**: Auto-heal broken selectors + AI failure analysis
- **Layer 7 (Reporting)**: Generate reports + validate requirements coverage
    ↓
agent-catalog (Service Discovery)
    ↓
agent-orchestrator (Test Orchestration)
    ↓
agent-functional (Functional Testing)
    ↓
agent-test-plan (VSTP Building)
    ↓
agent-explorer (UI Element Discovery)
    ↓
agent-codegen (Code Generation)
    ↓
agent-qa-gate (Quality Validation)
    ↓
Playwright (Test Execution)
    ↓
agent-report-composer (Report Generation)
    ↓
Reports & Artifacts
```

## 📦 Project Structure

```
agentic-playwright-mcp-framework/
├── config/                              # Master configuration
│   ├── path.properties                  # Path configurations
│   ├── credentials/Credentials.xml      # Encrypted credentials
│   ├── urls/Application_Url_Config.xlsx # URL configs
│   └── environments/                    # Environment configs
│       ├── ISB_DEV_Env.properties
│       ├── ISB_QA_Env.properties
│       ├── ISB_UAT_Env.properties
│       └── ISB_PROD_Env.properties
│
├── artifacts/                           # Generated artifacts pipeline
│   ├── resolved/                        # Connection configs
│   ├── catalog/                         # Service catalog
│   ├── vstp/                            # Test plans
│   ├── object-repository/               # UI elements
│   ├── qa-gate/                         # QA reports
│   ├── reports/                         # Final reports
│   └── logs/                            # Execution logs
│
├── packages/                            # Agent packages (npm workspaces)
│   ├── agents-core/                     # Core framework
│   ├── agent-connector/                 # Connection agent
│   ├── agent-login/                     # Login agent
│   ├── agent-catalog/                   # Catalog agent
│   ├── agent-orchestrator/              # Orchestration agent
│   ├── agent-functional/                # Functional testing agent
│   ├── agent-test-plan/                 # VSTP builder agent
│   ├── agent-explorer/                  # Element discovery agent
│   ├── agent-codegen/                   # Code generation agent
│   ├── agent-qa-gate/                   # QA validation agent
│   ├── agent-report-composer/           # Report generation agent
│   ├── agent-codemod/                   # Code transformation agent
│   └── agent-healer/                    # Selector healing agent
│
├── apps/                                # Test applications
│   └── example-webapp-tests/            # Example Playwright tests
│       ├── tests/
│       │   ├── generated/               # Agent-generated specs
│       │   └── manual/                  # Manually written tests
│       ├── pageObjects/                 # Page object models
│       ├── features/                    # BDD feature files
│       ├── test-data/                   # Test datasets
│       └── utils/                       # Utility functions
│
├── appModules/                          # Business utilities
│   └── utils/
│       ├── accountUtils.ts
│       ├── authUtils.ts
│       └── searchUtils.ts
│
├── scripts/                             # Pipeline automation
│   ├── run-pipeline.js                  # Main pipeline script
│   ├── clean-artifacts.js               # Cleanup script
│   └── generate-reports.js              # Report generation
│
├── docs/                                # Documentation
│   ├── architecture.md                  # System architecture
│   ├── pipeline.md                      # Pipeline guide
│   └── agents.md                        # Agent documentation
│
├── package.json                         # Root package.json
├── tsconfig.json                        # TypeScript configuration
├── playwright.config.ts                 # Playwright configuration
├── REQUIREMENTS.md                      # Project requirements
└── README.md                            # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** 8 or higher
- **Playwright** browsers (will auto-download)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd agentic-playwright-mcp-framework

# Install all dependencies
npm install

# Optional: Install Playwright browsers
npx playwright install
```

### Running the Pipeline

```bash
# Full pipeline execution
npm run pipeline

# Or run individual commands:
npm run build              # Build all packages
npm run test               # Run tests (workspaces)
npm run dev                # Development mode with watch
npm run clean              # Clean artifacts
npm run reports            # Generate reports
```

## 🔧 Configuration

### Environment Setup

1. **Select Environment**:
   ```bash
   export ENVIRONMENT=ISB_DEV  # or ISB_QA, ISB_UAT, ISB_PROD
   ```

2. **Update Credentials** (config/credentials/Credentials.xml):
   ```xml
   <Environment name="ISB_DEV">
       <Credential>
           <UserID>your_username</UserID>
           <Password>your_password</Password>
           <ApiKey>your_api_key</ApiKey>
       </Credential>
   </Environment>
   ```

3. **Update Application URL** (config/urls/Application_Url_Config.xlsx):
   - Set appropriate URLs for each environment

4. **Configure Paths** (config/path.properties):
   - Adjust base paths as needed

### Environment Properties

Each environment has its own configuration file:

```properties
# config/environments/ISB_DEV_Env.properties
ENVIRONMENT=ISB_DEV
APP_URL=http://dev.isb-example.com
API_BASE_URL=http://api-dev.isb-example.com
BROWSER=chromium           # chromium, firefox, webkit
HEADLESS=false             # false for development
TIMEOUT=30000              # ms
RETRY_COUNT=2
LOG_LEVEL=debug
```

## 📚 Agents Overview

| # | Agent | Purpose | Input | Output |
|---|-------|---------|-------|--------|
| 1 | **agent-connector** | Connection resolution | Config | connection-config.json |
| 2 | **agent-login** | Authentication | Credentials | Auth tokens |
| 3 | **agent-catalog** | Service discovery | appModules/ | utilities.json |
| 4 | **agent-orchestrator** | Test planning | Services | execution-plan.json |
| 5 | **agent-functional** | Functional tests | Plan | test-results.json |
| 6 | **agent-test-plan** | VSTP generation | Results | *.vstp.json |
| 7 | **agent-explorer** | Element discovery | App URL | elements.json |
| 8 | **agent-codegen** | Code generation | VSTP + Elements | *.spec.ts |
| 9 | **agent-qa-gate** | Quality validation | Generated code | qa-gate-report.json |
| 10 | **Playwright** | Test execution | *.spec.ts | Test results |
| 11 | **agent-report-composer** | Report generation | All results | HTML/JSON reports |

Additional agents: **agent-codemod** (code transformation), **agent-healer** (selector repair)

## 📋 Pipeline Stages

### Stage 1: Connection Resolution
```bash
agent-connector
├─ Input: config/path.properties + Environment
├─ Process: Resolve connections, validate connectivity
└─ Output: artifacts/resolved/connection-config.json
```

### Stage 2-11: Sequential Execution
Each stage uses the output of the previous stage. See [docs/pipeline.md](docs/pipeline.md) for detailed documentation.

## 🧪 Running Tests

### Run All Tests
```bash
npm test
```

### Run Playwright Tests Only
```bash
npx playwright test
```

### Run with UI Mode
```bash
npx playwright test --ui
```

### Run in Debug Mode
```bash
npx playwright test --debug
```

### Run Single Test File
```bash
npx playwright test apps/example-webapp-tests/tests/manual/sample.spec.ts
```

### Generate Test Code
```bash
npx playwright codegen http://localhost:3000
```

## 📊 Reports

Reports are generated in `artifacts/reports/`:

- **summary.html** - Executive summary with metrics
- **detail.html** - Detailed test results
- **db-report.html** - Database validation results
- **traceability.html** - Requirements traceability matrix

### View Reports
```bash
npm run reports                    # Generate reports
npx playwright show-report         # View Playwright report
```

## 🛠️ Development

### Adding a New Agent

1. Create directory: `packages/agent-newagent`
2. Create `package.json` with dependencies
3. Implement agent extending `BaseAgent`
4. Add to pipeline orchestrator

### TypeScript Build

```bash
# Build all packages
npm run build

# Build specific package
npm run build -w packages/agent-connector

# Watch mode
npm run dev
```

### Linting & Type Checking
```bash
npm run lint           # Run linters (workspaces)
npm run type-check     # Type checking
```

## 🔐 Security

- **Credentials**: Stored in encrypted XML files (config/credentials/)
- **Environment Separation**: Different configs per environment
- **Token Management**: Secure session token handling
- **Audit Logging**: All operations logged to artifacts/logs/

## 📈 Performance

Typical pipeline execution times:

| Phase | Duration | Notes |
|-------|----------|-------|
| Connection & Auth | 30-90s | Network dependent |
| Catalog & Planning | 1-2min | Service scanning |
| Element Discovery | 2-5min | App complexity dependent |
| Code Generation | 30-90s | Test case count dependent |
| QA Validation | 20-40s | Code quality checks |
| Playwright Execution | 5-30min+ | Test suite size dependent |
| Report Generation | 20-60s | Result aggregation |
| **Total** | **5-30+ minutes** | Full pipeline |

## 🐛 Troubleshooting

### Common Issues

**Issue**: Pipeline fails at connection stage
- **Solution**: Check credentials.xml and environment config

**Issue**: Element discovery times out
- **Solution**: Increase timeout in environment properties, check network

**Issue**: Generated tests fail
- **Solution**: Review qa-gate report, check object repository elements

**Issue**: Selector flakiness
- **Solution**: Enable agent-healer, review element locators

## 📖 Documentation

- [Architecture Overview](docs/architecture.md) - System design and components
- [Pipeline Guide](docs/pipeline.md) - Detailed pipeline execution
- [Agents Documentation](docs/agents.md) - Individual agent responsibilities
- [Requirements](REQUIREMENTS.md) - Project requirements
- [System Design](SYSTEM-DESIGN.md) - Comprehensive system design

## 🤝 Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Code style and standards
- Agent development
- Testing requirements
- Pull request process

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙋 Support

For questions or issues:
1. Check documentation in `docs/` folder
2. Review troubleshooting section
3. Open an issue with detailed information

## 📚 Technology Stack

- **Language**: TypeScript (ES2020+)
- **Test Framework**: Playwright
- **Runtime**: Node.js 18+
- **Package Manager**: npm with workspaces
- **Build**: TypeScript compiler
- **Architecture**: Model Context Protocol (MCP) based multi-agent system

## 🎯 Roadmap

Future enhancements:
- [ ] Integration with AI models for smarter test generation
- [ ] Distributed agent execution
- [ ] Cloud-based artifact storage
- [ ] Real-time test monitoring dashboard
- [ ] Mobile testing support
- [ ] API testing integration
- [ ] Performance testing agents
- [ ] Advanced ML-based selector healing