/**
 * Standard Agent Template with MCP Support
 * 
 * All agents in the framework should follow this pattern:
 * 1. Extend Agent base class
 * 2. Implement execute() method
 * 3. Create mcp-server.ts entry point
 * 4. Support agent-to-agent communication via MCPClient
 */

import { Agent } from '@agents/agents-core';
import pino from 'pino';

/**
 * Example Agent Implementation
 * 
 * Replace 'ExampleAgent' with your agent name
 * Replace 'example-agent' with your package name
 */
export class ExampleAgent extends Agent {
  private logger: pino.Logger;

  constructor() {
    // Agent name must match package name (without @agents/ prefix and dash)
    super('example-agent', '1.0.0');
    this.logger = pino({
      name: 'example-agent',
      level: process.env.LOG_LEVEL || 'info',
    });
  }

  /**
   * Main execution method
   * 
   * Called by MCPServer when client invokes the tool
   * 
   * @param input - Agent input payload
   * @returns Execution result
   */
  async execute(input: any): Promise<any> {
    this.logger.info({ input }, 'Executing example agent');

    try {
      // Example: Call another agent if needed
      // const result = await this.callAnotherAgent();

      // Your agent logic here
      const result = {
        processed: true,
        data: input,
        timestamp: new Date(),
      };

      this.logger.debug({ result }, 'Execution successful');
      return result;
    } catch (error) {
      this.logger.error(
        { error: error instanceof Error ? error.message : String(error) },
        'Execution failed'
      );
      throw error;
    }
  }

  /**
   * Optional: Call another agent via MCP
   * 
   * Pattern for agent-to-agent communication
   */
  private async callAnotherAgent(): Promise<any> {
    const { MCPClient } = await import('@agents/agents-core');

    const otherAgentClient = new MCPClient(
      'agent-other',
      '../agent-other/dist/mcp-server.js'
    );

    try {
      await otherAgentClient.connect();
      this.logger.debug('Connected to other agent');

      const result = await otherAgentClient.callTool(
        `task-dep-${Date.now()}`,
        { /* payload */ },
        { caller: this.getName() }
      );

      this.logger.info({ result }, 'Other agent result received');
      return result;
    } finally {
      await otherAgentClient.disconnect();
    }
  }
}
