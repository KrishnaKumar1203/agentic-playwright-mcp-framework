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

import { MCPServer } from './MCPServer.js';

export async function startAgentServer(
  agent: any,
  __filename: string,
  __dirname: string
): Promise<void> {
  const { fileURLToPath } = await import('url');
  const currentModule = fileURLToPath(import.meta.url);

  if (currentModule === __filename) {
    const server = new MCPServer(agent);
    await server.start();
  }
}
