# Quick Start: MCP Agent Framework

## 🚀 Get Up and Running in 10 Minutes

Your project has been updated to use the **Model Context Protocol (MCP)** for all agent communication.

---

## What You Need to Know (1 min)

```
Before: Agent A → direct call → Agent B
After:  Agent A → MCP JSON-RPC over stdio → Agent B Process

Benefits:
✅ Decoupled agents (can crash independently)
✅ Remote execution ready
✅ LLM integration possible
✅ Standard protocol (industry-standard MCP)
```

---

## Get Started (5 min)

### 1. Install Dependencies

```bash
npm install
npm run install-all
```

### 2. Build Everything

```bash
npm run build
```

### 3. Test One Agent as MCP Server

```bash
# Start agent-orchestrator as MCP server
node packages/agent-orchestrator/dist/mcp-server.js
```

You should see:
```
✓ agent-orchestrator MCP server started
```

Press `Ctrl+C` to stop.

### 4. Run Full MCP Pipeline

```bash
npm run pipeline:mcp
```

This executes all agents as MCP servers!

---

## Next: Implement MCP for Other Agents (5 min per agent)

### For Each Agent (15 remaining):

**1. Create `src/mcp-server.ts`:**
```typescript
import { MCPServer } from '@agents/agents-core';
import { YourAgent } from './your-agent.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const agent = new YourAgent();

async function startServer() {
  const server = new MCPServer(agent);
  await server.start();
  console.log('✓ agent-name MCP server started');
}

if (process.argv[1] === __filename) {
  startServer();
}
```

**2. Add to `package.json`:**
```json
{
  "dependencies": {
    "@agents/agents-core": "workspace:*",
    "@modelcontextprotocol/sdk": "^0.5.0",
    "pino": "^8.17.2"
  }
}
```

**3. Test:**
```bash
npm run build
node packages/agent-name/dist/mcp-server.js
```

---

## Key Concepts

### MCPServer (wraps agents)
```typescript
const server = new MCPServer(agent);
await server.start();  // Listens on stdin/stdout
```

### MCPClient (calls agents)
```typescript
const client = new MCPClient('agent-name', './dist/mcp-server.js');
await client.connect();
const result = await client.callTool('task-id', { data: 'input' });
```

### Agent Must Implement `execute()`
```typescript
async execute(input: any): Promise<any> {
  // Your logic here
  return { result: 'output' };
}
```

---

## File Organization

```
packages/
├── agents-core/                    ← Core MCP infrastructure
│   ├── src/
│   │   ├── MCPServer.ts           ← Wraps agents
│   │   ├── MCPClient.ts           ← Calls agents
│   │   └── Agent.ts               ← Base class
│   └── package.json               ← Has @modelcontextprotocol/sdk
│
├── agent-orchestrator/             ← Example implementation
│   ├── src/
│   │   ├── orchestrator.ts        ← Uses MCPClient
│   │   ├── mcp-server.ts          ← MCP entry point ✅
│   │   └── index.ts
│   └── package.json
│
└── agent-connector/                ← Needs MCP implementation
    ├── src/
    │   ├── connector.ts
    │   └── mcp-server.ts          ← CREATE THIS
    └── package.json                ← ADD DEPENDENCIES
```

---

## Verification

### ✅ All Done?
```bash
# Test any agent
node packages/agent-name/dist/mcp-server.js

# Run pipeline
npm run pipeline:mcp
```

### ❌ Something Wrong?
```bash
# Enable debug logging
LOG_LEVEL=debug npm run pipeline:mcp

# Check build
npm run build
npm run type-check
```

---

## One-Agent Example (Complete)

See: `packages/agent-orchestrator/src/`

- `orchestrator.ts` → Uses `MCPClient` to call other agents
- `mcp-server.ts` → MCP server entry point
- `package.json` → Has all dependencies

Copy this pattern for other agents!

---

## Commands Reference

```bash
# Build all agents
npm run build

# Test one agent as MCP server
node packages/<agent>/dist/mcp-server.js

# Run entire pipeline with MCP
npm run pipeline:mcp

# Debug mode
LOG_LEVEL=debug npm run pipeline:mcp

# Type check
npm run type-check

# Lint
npm run lint
```

---

## Documentation Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| IMPLEMENTATION_SUMMARY.md | Full overview | 10 min |
| MCP_SETUP_UPDATE.md | What changed & why | 5 min |
| **MCP_IMPLEMENTATION.md** | **Complete guide** | **20 min** |
| AGENT_MCP_CHECKLIST.md | Progress tracking | 5 min |
| AGENT_TEMPLATE.ts | Code template | 3 min |

**Start with:** `MCP_IMPLEMENTATION.md`

---

## Architecture

```
┌─────────────────────────────────────┐
│         Your Code                   │
│   (Pipeline / Orchestrator)         │
└─────────────────┬───────────────────┘
                  │
        MCP JSON-RPC via stdio
                  │
    ┌─────────────┴──────────────┐
    │                            │
┌───▼──────────────┐  ┌─────────▼───────┐
│  Agent A         │  │  Agent B        │
│ (MCP Server)     │  │ (MCP Server)    │
│ ┌──────────────┐ │  │ ┌────────────┐  │
│ │MCPServer     │ │  │ │MCPServer   │  │
│ ├──────────────┤ │  │ ├────────────┤  │
│ │Agent.execute │ │  │ │Agent.execute  │
│ └──────────────┘ │  │ └────────────┘  │
└──────────────────┘  └────────────────┘
```

---

## The Pattern

Every agent should have:

1. ✅ **Agent class** (extends Agent, implements execute())
2. ✅ **MCP Server** (wraps with MCPServer, exports for CLI)
3. ✅ **Dependencies** (has @modelcontextprotocol/sdk, pino)
4. ✅ **Build output** (dist/mcp-server.js exists)

---

## 5-Minute Checklist

- [ ] Run `npm run build`
- [ ] Run `node packages/agent-orchestrator/dist/mcp-server.js`
- [ ] See "✓ agent-orchestrator MCP server started"
- [ ] Stop it (Ctrl+C)
- [ ] Run `npm run pipeline:mcp`
- [ ] See pipeline output with all agents

**Done!** Next: implement MCP for other agents using the template above.

---

## Support

**Problem:** Agent doesn't start
```bash
npm run build
node packages/agent-name/dist/mcp-server.js
# Check error message
```

**Problem:** Pipeline fails
```bash
LOG_LEVEL=debug npm run pipeline:mcp
# Look at detailed logs
```

**Problem:** Not sure how to implement
1. Read MCP_IMPLEMENTATION.md
2. Copy agent-orchestrator pattern
3. Use AGENT_TEMPLATE.ts

---

## Next Steps

1. ✅ Read this file (done!)
2. 📖 Read MCP_IMPLEMENTATION.md (20 min)
3. 🔧 Implement MCP for 17 agents (2-3 hours)
4. ✨ Run `npm run pipeline:mcp`
5. 🎉 All agents now use MCP!

---

**All code changes now go through MCP agents!** 🚀

See `MCP_IMPLEMENTATION.md` for the complete guide.
