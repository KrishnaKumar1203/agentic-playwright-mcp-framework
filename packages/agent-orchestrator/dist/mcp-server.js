/**
 * MCP Server Entry Point for agent-orchestrator
 *
 * Usage:
 * - Start as MCP server: node dist/mcp-server.js
 * - As library: import { orchestratorAgent } from './dist/mcp-server.js'
 */
import { MCPServer } from '@agents/agents-core';
import { OrchestratorAgent } from './orchestrator.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
// Create agent instance
export const orchestratorAgent = new OrchestratorAgent();
// Start MCP server if run directly
async function startServer() {
    try {
        const server = new MCPServer(orchestratorAgent);
        await server.start();
        console.log('✓ agent-orchestrator MCP server started');
    }
    catch (error) {
        console.error('Failed to start agent-orchestrator MCP server:', error);
        process.exit(1);
    }
}
// Only start if run directly
if (process.argv[1] === __filename) {
    startServer();
}
//# sourceMappingURL=mcp-server.js.map