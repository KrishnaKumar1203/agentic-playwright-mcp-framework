/**
 * MCP Server Entry Point Template
 * 
 * Every agent should have an mcp-server.ts file that:
 * 1. Exports the agent instance
 * 2. Starts the MCP server if run directly
 * 
 * Usage:
 * - As a library: import { agent } from './mcp-server.js'
 * - As MCP server: node mcp-server.js
 */

export async function startAgentServer(
  agent: any,
  __filename: string,
  __dirname: string
): Promise<void> {
  import('url').then(({ fileURLToPath }) => {
    const currentModule = fileURLToPath(import.meta.url);
    
    // Only start server if this file is run directly
    if (currentModule === __filename) {
      import('@agents/agents-core').then(({ MCPServer }) => {
        const server = new MCPServer(agent);
        server.start().catch((error) => {
          console.error('Failed to start MCP server:', error);
          process.exit(1);
        });
      });
    }
  });
}
