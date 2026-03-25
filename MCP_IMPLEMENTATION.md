# MCP Server Implementation Guide

## Overview

This guide explains how to use **Model Context Protocol (MCP)** servers for all agent communication in the Agentic Playwright MCP Framework.

## What Changed

Your project previously used basic agent classes without MCP protocol. Now all agents:
- Run as **MCP servers** via stdio
- Communicate through the **Model Context Protocol**
- Support remote/distributed execution
- Follow standard MCP tooling patterns

## Architecture

```
┌─────────────────────┐
│   Pipeline/Client   │
└──────────┬──────────┘
           │
           │ MCP Stdio Transport
           │ (JSON-RPC over stdin/stdout)
           │
┌─────────────────────────────────────────┐
│  Agent Process                          │
├─────────────────────────────────────────┤
│ ┌──────────────────────────────────┐  │
│ │ MCPServer                        │  │
│ │ - Tool definitions               │  │
│ │ - Request handlers               │  │
│ │ - Error handling                 │  │
│ └──────────────────────────────────┘  │
│           ↓                            │
│ ┌──────────────────────────────────┐  │
│ │ Agent Instance (execute logic)   │  │
│ └──────────────────────────────────┘  │
│           ↓                            │
│ ┌──────────────────────────────────┐  │
│ │ Artifacts/Results                │  │
│ └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## How to Implement MCP for an Agent

### Step 1: Update Agent to Use MCPServer

Create an `mcp-server.ts` file in your agent's `src/` directory:

```typescript
// packages/agent-myagent/src/mcp-server.ts
import { MCPServer } from '@agents/agents-core';
import { MyAgent } from './my-agent.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Create agent instance
export const myAgent = new MyAgent();

// Start MCP server if run directly
async function startServer() {
  try {
    const server = new MCPServer(myAgent);
    await server.start();
    console.log('✓ agent-myagent MCP server started');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Only start if run directly
if (process.argv[1] === __filename) {
  startServer();
}
```

### Step 2: Update Agent's package.json

Add MCP SDK to your agent's dependencies:

```json
{
  "dependencies": {
    "@agents/agents-core": "workspace:*",
    "@modelcontextprotocol/sdk": "^0.5.0",
    "pino": "^8.17.2"
  }
}
```

### Step 3: Build and Test

```bash
# Build all agents
npm run build

# Run your agent as MCP server (for testing)
node packages/agent-myagent/dist/mcp-server.js
```

## How Agents Communicate

### Option 1: Direct MCP Client Call (agent-to-agent)

When one agent needs to call another:

```typescript
import { MCPClient } from '@agents/agents-core';

async function callAnotherAgent() {
  const mcpClient = new MCPClient('agent-other', '../agent-other/dist/mcp-server.js');
  
  try {
    await mcpClient.connect();
    
    const result = await mcpClient.callTool(
      'task-unique-id',
      { /* payload */ },
      { /* metadata */ }
    );
    
    console.log('Agent result:', result);
  } finally {
    await mcpClient.disconnect();
  }
}
```

### Option 2: Pipeline Execution (central orchestration)

Use the MCP pipeline script:

```bash
# Run entire pipeline via MCP
npm run pipeline:mcp
```

This executes all agents in sequence, with each agent running as an MCP server.

## Files Updated

### Core Framework

- `packages/agents-core/src/MCPServer.ts` - MCP server wrapper for agents
- `packages/agents-core/src/MCPClient.ts` - MCP client for agent communication
- `packages/agents-core/src/index.ts` - Exports MCP classes
- `packages/agents-core/package.json` - Added MCP SDK dependency

### Agents

- `packages/agent-orchestrator/src/orchestrator.ts` - Updated to use MCPClient
- `packages/agent-orchestrator/src/mcp-server.ts` - MCP server entry point
- `packages/agent-orchestrator/package.json` - Added pino dependency

### Pipeline

- `scripts/run-mcp-pipeline.js` - New MCP-based pipeline implementation
- `package.json` - Added `pipeline:mcp` script

## MCP Protocol Details

### Agent Tool Definition

Each agent exposes a tool via MCP:

```
Tool Name: {agentName}_execute
```

### Tool Input Schema

```json
{
  "taskId": "string - unique task identifier",
  "payload": "object - agent input data",
  "metadata": "object - optional metadata"
}
```

### Tool Output (AgentOutput)

```json
{
  "id": "agent id",
  "taskId": "unique task id",
  "result": "execution result",
  "status": "success | failure | skipped",
  "error": "error object if failed",
  "timestamp": "ISO timestamp"
}
```

## Example: Agent Calling Another Agent

```typescript
import { MCPClient, AgentOutput } from '@agents/agents-core';

export class MyAgent extends Agent {
  async execute(input: any): Promise<any> {
    // Call another agent via MCP
    const connectorClient = new MCPClient(
      'agent-connector',
      '../agent-connector/dist/mcp-server.js'
    );

    try {
      await connectorClient.connect();
      
      const connectorResult: AgentOutput = await connectorClient.callTool(
        `task-connect-${Date.now()}`,
        { /* connection config */ },
        { /* metadata */ }
      );

      if (connectorResult.status === 'success') {
        console.log('Connection established:', connectorResult.result);
        // Use result to continue execution
      } else {
        throw new Error('Connection failed');
      }
    } finally {
      await connectorClient.disconnect();
    }
  }
}
```

## Testing MCP Agents

### Test 1: Run Agent as MCP Server

```bash
# Terminal 1: Start agent as MCP server
node packages/agent-connector/dist/mcp-server.js
```

### Test 2: Call Agent via MCP Client

```typescript
// test-agent.ts
import { MCPClient } from '@agents/agents-core';

async function test() {
  const client = new MCPClient('agent-connector', './packages/agent-connector/dist/mcp-server.js');
  await client.connect();
  
  const result = await client.callTool(
    'test-task',
    { /* test payload */ }
  );
  
  console.log('Result:', result);
  await client.disconnect();
}

test();
```

## Benefits of MCP Architecture

1. **Standard Protocol** - Uses industry-standard MCP (Model Context Protocol)
2. **Remote Execution** - Agents can run on different machines/processes
3. **Tool Discovery** - Claude and other LLMs can discover agent capabilities
4. **Error Handling** - Built-in error recovery and status tracking
5. **Isolation** - Agent crashes don't cascade to other agents
6. **Scalability** - Easy to add more agents without modifying core
7. **Distributed Testing** - Run agents in parallel across multiple hosts

## Migration Checklist

For each agent package, ensure:

- [ ] Create `src/mcp-server.ts` entry point
- [ ] Update `package.json` with MCP SDK dependency
- [ ] Add `pino` for logging
- [ ] Update `tsconfig.json` if needed
- [ ] Build: `npm run build`
- [ ] Test: `node dist/mcp-server.js`
- [ ] If calling other agents, use `MCPClient`

## Troubleshooting

### "MCP client not connected"

```typescript
// Always check connection
if (!client.isConnected()) {
  await client.connect();
}
```

### Agent process exits immediately

Check logs:
```bash
LOG_LEVEL=debug npm run pipeline:mcp
```

### Build errors with MCP imports

```bash
# Rebuild agents-core first
npm run build -w @agents/agents-core
# Then rebuild dependent agents
npm run build
```

## Next Steps

1. **Implement MCP servers** for all 19 agents
2. **Update agent communication** to use MCPClient
3. **Add distributed execution** support (optional)
4. **Integrate with Claude** via MCP tools (optional)

## Documentation Links

- [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/node-sdk)
- [MCP TypeScript Guide](https://modelcontextprotocol.io/docs/tools/typescript)

---

**All code changes must now go through MCP agents via the Playwright MCP framework!** 🚀
